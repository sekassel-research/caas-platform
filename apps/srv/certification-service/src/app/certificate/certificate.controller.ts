import { Controller, Delete, Get, NotFoundException, Param, Post, Body, Query, UseGuards, BadRequestException, Put } from '@nestjs/common';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { MongoIdPipe } from '@caas/srv/mongo';

import { Certificate } from './certificate.schema';
import { CertificatesService } from './certificate.service';
import { CreateCertificateDto, UpdateCertificateDto } from './dto';
import { environment as Environment } from '../../environments/environment';

@Controller('certificates')
@UseGuards(RoleGuard)
export class CertificateController {
  constructor(private certificatesService: CertificatesService) {}

  @Post()
  async create(@Body() dto: CreateCertificateDto): Promise<Certificate> {
    const oldCertificate = await this.certificatesService.getOneByName(dto.name);

    if (oldCertificate) {
      throw new BadRequestException(`Certificate with name ${dto.name} already exists.`);
    }
    if (!dto.version.match(Environment.REGEX_VERSION_FORMAT)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }

    return this.certificatesService.create(dto);
  }

  @Put(':id')
  async updateOne(@Param('id', new MongoIdPipe()) id: string, @Body() dto: UpdateCertificateDto): Promise<Certificate> {
    const certificate = await this.certificatesService.getOne(id);
    if (!certificate) {
      throw new NotFoundException('Could not find certificate with given ID.');
    }
    if (!dto.version.match(Environment.REGEX_VERSION_FORMAT)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (dto.version && certificate.version === dto.version) {
      throw new BadRequestException('Version needs to be increased');
    }

    return this.certificatesService.updateOne(dto, certificate);
  }

  @Get()
  @Roles('r')
  async getAll(): Promise<Certificate[]> {
    return this.certificatesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<Certificate> {
    const certificate = await this.certificatesService.getOne(id, populate);
    if (!certificate) {
      throw new NotFoundException('Could not find certificate with given ID.');
    }
    return certificate;
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<Certificate> {
    const certificate = await this.certificatesService.getOne(id);
    if (!certificate) {
      throw new NotFoundException('Could not find certificate with given ID.');
    }
    await this.certificatesService.deleteOne(certificate);
    return certificate;
  }
}
