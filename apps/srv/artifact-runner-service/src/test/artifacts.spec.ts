import { HttpStatus, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthMiddlewareMock } from '@caas/srv/auth';
import { ConfigModule } from '@caas/srv/config';
import { KafkaModuleMock } from '@caas/srv/kafka';

import { ArtifactsModule } from '../app/artifacts';

import bodyParser = require('body-parser');
import express = require('express');
import request = require('supertest');
import { mongo } from 'mongoose';

const artifact1 = {
  name: 'MyFirstService',
  version: '1.0.0',
  dockerImage: 'reg/my-fir-service:1.0.0',
};

const artifact2 = {
  name: 'MySecondService',
  version: '1.0.2',
  dockerImage: 'reg/my-sec-service:1.0.2',
};

const artifact3 = {
  name: 'MyThirdService',
  version: '1.1.0',
  dockerImage: 'reg/my-thi-service:1.1.0',
};

const brokenArtifact1 = {
  name: 'MyFirstBrokenService',
  version: '023:!',
  dockerImage: 'reg/my-fir-service:1.1.3',
};

const brokenArtifact2 = {
  name: 'MySecondBrokenService',
  version: '1.0.3',
  dockerImage: 'reg///bRKeeN-sErvicce:::1.1',
};

describe('Artifacts', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  const server = express();
  server.use(bodyParser.json());

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    const mongoUri = process.env.MONGO_URI || (await mongod.getUri());

    const module = await Test.createTestingModule({
      imports: [
        ArtifactsModule,
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

  // Positive base testing of endpoints
  it('A.1 should create new artifacts', async (done) => {
    await request(server).post('/artifacts').send(artifact1).expect(HttpStatus.CREATED);
    await request(server).post('/artifacts').send(artifact2).expect(HttpStatus.CREATED);
    await request(server).post('/artifacts').send(artifact3).expect(HttpStatus.CREATED);

    done();
  });

  it('A.2 should get a list of all artifacts', async (done) => {
    const res = await request(server).get('/artifacts').expect(HttpStatus.OK);

    const artifacts = res.body;
    expect(artifacts.length).toBe(3);
    expect(artifacts[0]).toEqual(expect.objectContaining(artifact1));
    expect(artifacts[1]).toEqual(expect.objectContaining(artifact2));
    expect(artifacts[2]).toEqual(expect.objectContaining(artifact3));

    done();
  });

  it('A.3 should get a specific artifact', async (done) => {
    let res = await request(server).get('/artifacts').expect(HttpStatus.OK);

    const artifacts = res.body;
    expect(artifacts.length).toBe(3);

    res = await request(server)
      .get('/artifacts/' + artifacts[0].id)
      .expect(HttpStatus.OK);

    const artifact = res.body;
    expect(artifact).toEqual(expect.objectContaining(artifact1));

    done();
  });

  it('A.4 should update a specific artifact', async (done) => {
    let res = await request(server).get('/artifacts').expect(HttpStatus.OK);

    const artifacts = res.body;
    expect(artifacts.length).toBe(3);

    res = await request(server)
      .put('/artifacts/' + artifacts[0].id)
      .send({ ...artifact1, name: 'updatedName', version: '1.1.0' })
      .expect(HttpStatus.OK);

    res = await request(server)
      .get('/artifacts/' + artifacts[0].id + '?populate=history')
      .expect(HttpStatus.OK);

    const artifact = res.body;
    expect(artifact).toEqual(expect.objectContaining({ ...artifact1, name: 'updatedName', version: '1.1.0' }));
    expect(artifact.history).toBeDefined();
    expect(artifact.history.length).toBe(1);
    expect(artifact.history[0]).toEqual(expect.objectContaining(artifact1));

    done();
  });

  it('A.5 should delete a specific artifact', async (done) => {
    let res = await request(server).get('/artifacts').expect(HttpStatus.OK);

    let artifacts = res.body;
    expect(artifacts.length).toBe(3);

    res = await request(server)
      .delete('/artifacts/' + artifacts[0].id)
      .expect(HttpStatus.OK);
    expect(res.body.id).toBe(artifacts[0].id);

    res = await request(server).get('/artifacts').expect(HttpStatus.OK);

    artifacts = res.body;
    expect(artifacts.length).toBe(2);

    done();
  });

  // Negative error testing of endpoints
  it('A.6 shouldn\'t create new artifacts', async (done) => {
    await request(server).post('/artifacts').send(brokenArtifact1).expect(HttpStatus.BAD_REQUEST);
    await request(server).post('/artifacts').send(brokenArtifact2).expect(HttpStatus.BAD_REQUEST);

    done();
  });

  it('A.7 shouldn\'t create duplicate artifacts', async (done) => {
    await request(server).post('/artifacts').send(artifact1).expect(HttpStatus.CREATED);
    await request(server).post('/artifacts').send(artifact1).expect(HttpStatus.BAD_REQUEST);

    done();
  });

  it('A.8 shouldn\'t find artifact', async (done) => {
    await request(server).get('/artifacts/do-i-exist').expect(HttpStatus.BAD_REQUEST);
    await request(server).get('/artifacts/' + '421337c5b75b7f8bedee08ad').expect(HttpStatus.NOT_FOUND);

    done();
  });

  it('A.9 shouldn\'t update artifact', async (done) => {
    await request(server).put('/artifacts/where-am-i').expect(HttpStatus.BAD_REQUEST);
    await request(server).get('/artifacts/' + '133742c5b75b7f8bedee08ad').expect(HttpStatus.NOT_FOUND);
    // TODO implement BadRequestExceptions

    done();
  });

  it('A.10 shouldn\'t delete artifact', async (done) => {
    await request(server).del('/artifacts/hide-and-seek').expect(HttpStatus.BAD_REQUEST);
    await request(server).get('/artifacts/' + '424242c5b75b7f8bedee08ad').expect(HttpStatus.NOT_FOUND);

    done();
  });
});
