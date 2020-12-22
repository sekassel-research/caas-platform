import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Certificate } from './certificate.schema';
import { CreateCertificateDto, UpdateCertificateDto } from './dto';

@Injectable()
export class CertificatesService {
  constructor(@InjectModel('certificates') private readonly certificatesModel: Model<Certificate>) {}

  async create(dto: CreateCertificateDto): Promise<Certificate> {
    return this.certificatesModel.create(dto);
  }

  async getAll(): Promise<Certificate[]> {
    return this.certificatesModel.find().exec();
  }

  async getOne(id?: string, populate?: string): Promise<Certificate> {
    populate = populate || '';
    return this.certificatesModel.findById(id).populate(populate).exec();
  }

  async getOneByName(name: string): Promise<Certificate> {
    return this.certificatesModel.findOne({ name }).exec();
  }

  async updateOne(dto: UpdateCertificateDto, oldCertificate: Certificate): Promise<Certificate> {
    const updateId = oldCertificate.id;

    return this.certificatesModel.findOneAndUpdate({ _id: updateId }, { $set: dto }, { new: true }).exec();
  }

  async deleteOne(certificate: Certificate): Promise<string> {
    await this.certificatesModel.deleteOne({ _id: certificate.id }).exec();

    return certificate.id;
  }
}
