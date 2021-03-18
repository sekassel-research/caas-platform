import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka, Payload } from '@nestjs/microservices';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { KafkaExceptionFilter, KafkaTopic } from '@caas/srv/kafka';
import { MongoIdPipe } from '@caas/srv/mongo';

import { Artifact } from './artifacts.schema';
import { ArtifactsService } from './artifacts.service';
import { CreateArtifactDto, UpdateArtifactDto } from './dto';
import { CertificateGrantedEvent } from './events';

@Controller('artifacts')
@UseGuards(RoleGuard)
export class ArtifactsController {
  private readonly logger = new Logger(ArtifactsController.name);

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka, private artifactsService: ArtifactsService) {}

  // -----------REST-----------
  @Post()
  async create(@Body() dto: CreateArtifactDto): Promise<Artifact> {
    const oldArtifact = await this.artifactsService.getOneByName(dto.name);
    if (oldArtifact) {
      throw new BadRequestException(`Artifact with name ${dto.name} already exists.`);
    }
    if (!dto.version.match(/\d+\.\d+\.\d+/)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (!dto.dockerImage.match(/([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.artifactsService.create(dto);
  }

  @Get()
  @Roles('r')
  async getAll(): Promise<Artifact[]> {
    return this.artifactsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<Artifact> {
    const artifact = await this.artifactsService.getOne(id, populate);
    if (!artifact) {
      throw new NotFoundException('Could not find artifact with given ID.');
    }

    return artifact;
  }

  @Put(':id')
  async updateOne(@Param('id', new MongoIdPipe()) id: string, @Body() dto: UpdateArtifactDto): Promise<Artifact> {
    const artifact = await this.artifactsService.getOne(id);
    if (!artifact) {
      throw new NotFoundException('Could not find artifact with given ID.');
    }
    if (!dto.version.match(/\d+\.\d+\.\d+/)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (dto.version && artifact.version === dto.version) {
      throw new BadRequestException('Version needs to be increased');
    }
    if (!dto.dockerImage.match(/([\w-]+\/)?([\w-]+:\d\.\d\.\d)/)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.artifactsService.updateOne(dto, artifact);
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<Artifact> {
    const artifact = await this.artifactsService.getOne(id);
    if (!artifact) {
      throw new NotFoundException('Could not find artifact with given ID.');
    }

    await this.artifactsService.deleteOne(artifact);
    return artifact;
  }

  // -----------KAFKA-----------
  /**
   * TEST_IMPLEMENTATION_FOR_TESTING_ONLY
   * @param event
   */
  @UseFilters(KafkaExceptionFilter)
  @KafkaTopic('certification')
  async onCertificateGranted(@Payload() event: CertificateGrantedEvent): Promise<void> {
    this.logger.log('Consumed CertificateGrantedEvent.');
    console.log(event);
  }
}
