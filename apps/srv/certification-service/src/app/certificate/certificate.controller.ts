import { Controller, Delete, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { MongoIdPipe } from '@caas/srv/mongo';

import { Certificate } from './certificate.schema';
import { CertificatesService } from './certificate.service';

@Controller('certificates')
@UseGuards(RoleGuard)
export class CertificateController {
  constructor(private certificatesService: CertificatesService) {}

  @Get()
  @Roles('r')
  async getAll(): Promise<Certificate[]> {
    return this.certificatesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<Certificate> {
    const certificate = await this.certificatesService.getOne(id, populate);
    if (!certificate) {
      throw new NotFoundException('Could not find artifact with given ID.');
    }
    return certificate;
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<Certificate> {
    const certificate = await this.certificatesService.getOne(id);
    if (!certificate) {
      throw new NotFoundException('Could not find artifact with given ID.');
    }
    await this.certificatesService.deleteOne(certificate);
    return certificate;
  }
}
