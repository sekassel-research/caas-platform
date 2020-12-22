import { BadRequestException, PipeTransform } from '@nestjs/common';

import { isMongoId } from 'class-validator';

export class MongoIdPipe implements PipeTransform<string> {
  async transform(value: string): Promise<string> {
    if (!isMongoId(value)) {
      throw new BadRequestException('ID must be an ObjectId');
    }
    return value;
  }
}
