import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthMiddlewareMock } from '@caas/srv/auth';
import { ConfigModule } from '@caas/srv/config';
import { KafkaModuleMock } from '@caas/srv/kafka';

import bodyParser = require('body-parser');
import express = require('express');

describe('Job-Executor', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  const server = express();
  server.use(bodyParser.json());

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    const mongoUri = process.env.MONGO_URI || (await mongod.getUri());

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        KafkaModuleMock.forRootAsync(),
        MongooseModule.forRoot(mongoUri, {
          useCreateIndex: true,
          useFindAndModify: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication(new ExpressAdapter(server));
    app.use(AuthMiddlewareMock);
    await app.init();
  }, 60000);

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  }, 60000);

  // TODO: Positive base of kafka
  it('E.1 Dummy', async (done) => done());

  // TODO: Negative base of kafka
});
