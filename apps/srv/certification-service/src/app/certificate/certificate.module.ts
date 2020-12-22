import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateController } from './certificate.controller';
import { CertificateSchema } from './certificate.schema';
import { CertificatesService } from './certificate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'certificates', schema: CertificateSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificatesService],
})
export class CertificateModule {}