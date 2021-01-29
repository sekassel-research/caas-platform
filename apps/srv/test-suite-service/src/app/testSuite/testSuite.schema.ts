import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as toJson from '@meanie/mongoose-to-json';

@Schema()
export class TestSuite extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  dockerImage: string;
}

export const TestSuiteSchema = SchemaFactory.createForClass(TestSuite);

TestSuiteSchema.plugin(toJson);
