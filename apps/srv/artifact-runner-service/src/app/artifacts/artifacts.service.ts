import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobExecutorService, JobState } from '@caas/srv/job-executor';

import { Model } from 'mongoose';

import { Artifact, HistoryArtifact } from './artifacts.schema';
import { CreateArtifactDto, UpdateArtifactDto } from './dto';
import { ValidateDockerJob } from './jobs/validate-docker.job';
import { PullDockerImageJob } from './jobs/pull-docker-image.job';

@Injectable()
export class ArtifactsService {
  constructor(
    @InjectModel('artifacts') private readonly artifactsModel: Model<Artifact>,
    @InjectModel('historyArtifacts') private readonly historyModel: Model<HistoryArtifact>,
    private readonly jobExecutorService: JobExecutorService
  ) { }

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

  // TODO: Remove deprecation warning
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

  async validateDockerImage() {
    const job = new ValidateDockerJob();

    if (this.jobExecutorService.executeJob(job)) {
      // TODO
      this.pullDockerImage();
    }
  }

  async pullDockerImage() {
    const job = new PullDockerImageJob();

    if (this.jobExecutorService.executeJob(job)) {
      // TODO
    }
  }
}
