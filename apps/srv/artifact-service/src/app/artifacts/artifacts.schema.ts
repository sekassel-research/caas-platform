import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import * as toJson from '@meanie/mongoose-to-json';

@Schema()
export class HistoryArtifact extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  dockerImage: string;
}

@Schema()
export class Artifact extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  dockerImage: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'historyArtifacts' }],
    required: true,
  })
  history: HistoryArtifact[];

  @Prop({ type: Types.ObjectId })
  certificate: string;
}

export const ArtifactSchema = SchemaFactory.createForClass(Artifact);
export const HistoryArtifactSchema = SchemaFactory.createForClass(HistoryArtifact);

ArtifactSchema.plugin(toJson);
HistoryArtifactSchema.plugin(toJson);
