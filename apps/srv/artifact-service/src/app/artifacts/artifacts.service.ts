import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { JobEvent } from '@caas/srv/kafka';

import { Artifact, HistoryArtifact } from './artifacts.schema';
import { CreateArtifactDto, UpdateArtifactDto } from './dto';
import { environment as Environment } from '../../environments/environment';

@Injectable()
export class ArtifactsService {
  private readonly logger = new Logger(ArtifactsService.name);

  constructor(
    @InjectModel('artifacts') private readonly artifactsModel: Model<Artifact>,
    @InjectModel('historyArtifacts') private readonly historyModel: Model<HistoryArtifact>,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async create(dto: CreateArtifactDto): Promise<Artifact> {
    const dtoWithHistory = dto as Artifact;
    dtoWithHistory.history = [];

    return this.artifactsModel.create(dtoWithHistory);
  }

  async getAll(): Promise<Artifact[]> {
    return this.artifactsModel.find().exec();
  }

  async getOne(id?: string, populate?: string): Promise<Artifact> {
    populate = populate || '';
    return this.artifactsModel.findById(id).populate(populate).exec();
  }

  async getOneByName(name: string): Promise<Artifact> {
    return this.artifactsModel.findOne({ name }).exec();
  }

  async updateOne(dto: UpdateArtifactDto, oldArtifact: Artifact): Promise<Artifact> {
    const updateId = oldArtifact.id;
    const dtoWithHistory = dto as Artifact;
    dtoWithHistory.history = oldArtifact.history;

    // create a temp object for old artifact to save is in the history collection
    const temp = {
      name: oldArtifact.name,
      version: oldArtifact.version,
      dockerImage: oldArtifact.dockerImage,
    };

    // create history entry
    const historyArtifact = await this.historyModel.create(temp);

    // add old artifact to the history of the current artifact
    dtoWithHistory.history.push(historyArtifact as Artifact);

    return this.artifactsModel.findOneAndUpdate({ _id: updateId }, { $set: dtoWithHistory }, { new: true }).exec();
  }

  async deleteOne(artifact: Artifact): Promise<string> {
    for (const id of artifact.history) {
      await this.historyModel.deleteOne({ _id: id }).exec();
    }
    await this.artifactsModel.deleteOne({ _id: artifact.id }).exec();

    return artifact.id;
  }

  async pullDockerImage(dockerTag: string) {
    const jobevent = new JobEvent('docker pull', dockerTag, '', '');
    this.logger.log('Emitted jobexecute-Event.');
    this.kafkaClient.emit<string>(Environment.KAFKA_JOB_EXECUTE, JSON.stringify(jobevent));
  }

  async runDockerImage(dockerTag: string, name: string) {
    const jobevent = new JobEvent('docker run', dockerTag, `--name ${name}`, '');
    this.logger.log('Emitted jobexecute-Event.');
    this.kafkaClient.emit<string>(Environment.KAFKA_JOB_EXECUTE, JSON.stringify(jobevent));
  }
}
