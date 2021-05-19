import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import * as toJson from '@meanie/mongoose-to-json';

@Schema()
export class TestOrchestrator extends Document {
  @Prop({ required: true })
  status: string;

  @Prop({ type: Types.ObjectId })
  artifactId: string;

  @Prop({ type: Types.ObjectId })
  certificateId: string;
}

export const TestOrchestratorSchema = SchemaFactory.createForClass(TestOrchestrator);

TestOrchestratorSchema.plugin(toJson);
