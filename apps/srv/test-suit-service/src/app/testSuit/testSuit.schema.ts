import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as toJson from '@meanie/mongoose-to-json';

@Schema()
export class TestSuit extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  dockerImage: string;
}

export const TestSuitSchema = SchemaFactory.createForClass(TestSuit);

TestSuitSchema.plugin(toJson);
