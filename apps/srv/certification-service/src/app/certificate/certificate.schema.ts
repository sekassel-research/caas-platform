import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

import * as toJson from '@meanie/mongoose-to-json';

@Schema()
export class Certificate extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  signature: string;

  @Prop({ type: [Types.ObjectId], required: true })
  confirmanceTests: string[];
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

CertificateSchema.plugin(toJson);
