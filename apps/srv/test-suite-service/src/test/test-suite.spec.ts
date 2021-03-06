import { HttpStatus, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthMiddlewareMock } from '@caas/srv/auth';
import { ConfigModule } from '@caas/srv/config';

import { TestSuitesModule } from '../app/testSuite';

import bodyParser = require('body-parser');
import express = require('express');
import request = require('supertest');

const testSuite1 = {
  name: 'MyFirstService',
  version: '1.0.0',
  dockerImage: 'reg/my-fir-service:1.0.0',
};

const testSuite2 = {
  name: 'MySecondService',
  version: '1.0.2',
  dockerImage: 'reg/my-sec-service:1.0.2',
};

const testSuite3 = {
  name: 'MyThirdService',
  version: '1.1.0',
  dockerImage: 'reg/my-thi-service:1.1.0',
};

const brokentestSuite1 = {
  name: 'MyFirstBrokenService',
  version: '023:!',
  dockerImage: 'reg/my-fir-service:1.0.0',
};

const brokentestSuite2 = {
  name: 'MySecondBrokenService',
  version: '1.0.5',
  dockerImage: 'reg//brok-sErvicce::1.3',
};

describe('TestSuites', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  const server = express();
  server.use(bodyParser.json());

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    const mongoUri = process.env.MONGO_URI || (await mongod.getUri());

    const module = await Test.createTestingModule({
      imports: [
        TestSuitesModule,
        ConfigModule.forRoot(),
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
  it('T.1 should create new testSuites', async (done) => {
    await request(server).post('/testSuites').send(testSuite1).expect(HttpStatus.CREATED);
    await request(server).post('/testSuites').send(testSuite2).expect(HttpStatus.CREATED);
    await request(server).post('/testSuites').send(testSuite3).expect(HttpStatus.CREATED);

    done();
  });

  it('T.2 should get a list of all testSuites', async (done) => {
    const res = await request(server).get('/testSuites').expect(HttpStatus.OK);

    const testSuites = res.body;
    expect(testSuites.length).toBe(3);
    expect(testSuites[0]).toEqual(expect.objectContaining(testSuite1));
    expect(testSuites[1]).toEqual(expect.objectContaining(testSuite2));
    expect(testSuites[2]).toEqual(expect.objectContaining(testSuite3));

    done();
  });

  it('T.3 should get a specific testSuite', async (done) => {
    let res = await request(server).get('/testSuites').expect(HttpStatus.OK);

    const testSuites = res.body;
    expect(testSuites.length).toBe(3);

    res = await request(server)
      .get('/testSuites/' + testSuites[0].id)
      .expect(HttpStatus.OK);

    const testSuite = res.body;
    expect(testSuite).toEqual(expect.objectContaining(testSuite1));

    done();
  });

  it('T.4 should update a specific testSuite', async (done) => {
    let res = await request(server).get('/testSuites').expect(HttpStatus.OK);

    const testSuites = res.body;
    expect(testSuites.length).toBe(3);

    const previousTestSuite = testSuites[0];

    res = await request(server)
      .put('/testSuites/' + testSuites[0].id)
      .send({ ...testSuite1, name: 'updatedName', version: '1.1.0' })
      .expect(HttpStatus.OK);

    const testSuite = res.body;
    expect(previousTestSuite.id).toEqual(testSuite.id);
    expect(testSuite).toEqual(expect.objectContaining({ ...testSuite1, name: 'updatedName', version: '1.1.0' }));

    done();
  });

  it('T.5 should delete a specific testSuite', async (done) => {
    let res = await request(server).get('/testSuites').expect(HttpStatus.OK);

    let testSuites = res.body;
    expect(testSuites.length).toBe(3);

    res = await request(server)
      .delete('/testSuites/' + testSuites[0].id)
      .expect(HttpStatus.OK);
    expect(res.body.id).toBe(testSuites[0].id);

    res = await request(server).get('/testSuites').expect(HttpStatus.OK);

    testSuites = res.body;
    expect(testSuites.length).toBe(2);

    done();
  });

  // Negative error testing of endpoints
  it('T.6 should not create new testSuites', async (done) => {
    await request(server).post('/testSuites').send(brokentestSuite1).expect(HttpStatus.BAD_REQUEST);
    await request(server).post('/testSuites').send(brokentestSuite2).expect(HttpStatus.BAD_REQUEST);

    done();
  });

  it('T.7 should not create duplicate testSuites', async (done) => {
    await request(server).post('/testSuites').send(testSuite1).expect(HttpStatus.CREATED);
    await request(server).post('/testSuites').send(testSuite1).expect(HttpStatus.BAD_REQUEST);

    done();
  });

  it('T.8 should not find a specific testSuite', async (done) => {
    await request(server).get('/testSuites/do-i-exist').expect(HttpStatus.BAD_REQUEST);
    await request(server)
      .get('/testSuites/' + '139937c5b75b7f8bedee08ad')
      .expect(HttpStatus.NOT_FOUND);

    done();
  });

  it('T.9 should not update testSuite', async (done) => {
    await request(server).put('/testSuites/where-am-i').expect(HttpStatus.BAD_REQUEST);

    await request(server)
      .get('/testSuites/' + '133742c5b75b7f8bedee08ad')
      .expect(HttpStatus.NOT_FOUND);

    let res = await request(server).get('/testSuites').expect(HttpStatus.OK);
    const testSuites = res.body;
    expect(testSuites.length).toBe(3);

    res = await request(server)
      .put('/testSuites/' + testSuites[0].id)
      .send({ ...testSuite1, name: 'updatedName', version: testSuites[0].version })
      .expect(HttpStatus.BAD_REQUEST);

    res = await request(server)
      .put('/testSuites/' + testSuites[0].id)
      .send({ ...testSuite1, name: 'updatedName', version: '1asd!.1.0' })
      .expect(HttpStatus.BAD_REQUEST);

    res = await request(server)
      .put('/testSuites/' + testSuites[0].id)
      .send({ ...testSuite1, name: 'updatedName', dockerImage: 'reg///bRK!' })
      .expect(HttpStatus.BAD_REQUEST);

    done();
  });

  it('T.10 should not delete testSuite', async (done) => {
    await request(server).del('/testSuites/hide-and-seek').expect(HttpStatus.BAD_REQUEST);
    await request(server)
      .get('/testSuites/' + '424242c5b75b7f8bedee08ad')
      .expect(HttpStatus.NOT_FOUND);

    done();
  });
});
