import { HttpStatus, INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthMiddlewareMock } from '@caas/srv/auth';
import { ConfigModule } from '@caas/srv/config';

import { CertificateModule, CertificatesService } from '../app/certificate';

import bodyParser = require('body-parser');
import express = require('express');
import request = require('supertest');

const certificate1 = {
  name: 'MyFirstCertificate',
  version: '1.0.0',
  signature: 'e225bcda-d912-469a-86bf-fcf98e67d51c',
};

const certificate2 = {
  name: 'MySecondCertificate',
  version: '1.0.2',
  signature: 'bd659468-c492-4948-ba4c-63208ee94b87',
};

const certificate3 = {
  name: 'MyThirdCertificate',
  version: '1.1.0',
  signature: '6eada95c-e228-4b8d-a980-3d11be2710f2',
};

describe('Certificats', () => {
  let app: INestApplication;
  let mongodb: MongoMemoryServer;
  const server = express();
  server.use(bodyParser.json());

  beforeAll(async () => {
    mongodb = new MongoMemoryServer();
    const mongoUri = process.env.MONGO_URI || (await mongodb.getUri());

    const module = await Test.createTestingModule({
      imports: [
        CertificateModule,
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
    await mongodb.stop();
  }, 60000);

  // Positive base testing of endpoints
  it('C.1 should create new certificates', async (done) => {
    const service = app.get(CertificatesService);
    service.create(certificate1);
    service.create(certificate2);
    service.create(certificate3);

    const res = await request(server).get('/certificate').expect(HttpStatus.OK);

    const certificates = res.body;
    expect(certificates.length).toBe(3);

    done();
  });

  it('C.2 should get a list of all certificates', async (done) => {
    const res = await request(server).get('/certificate').expect(HttpStatus.OK);

    const certificates = res.body;
    expect(certificates.length).toBe(3);
    expect(certificates[0]).toEqual(expect.objectContaining(certificate1));
    expect(certificates[1]).toEqual(expect.objectContaining(certificate2));
    expect(certificates[2]).toEqual(expect.objectContaining(certificate3));

    done();
  });

  it('C.3 should get a specific certificate', async (done) => {
    let res = await request(server).get('/certificate').expect(HttpStatus.OK);

    const certificates = res.body;
    expect(certificates.length).toBe(3);

    res = await request(server)
      .get('/certificate/' + certificates[0].id)
      .expect(HttpStatus.OK);

    const certificate = res.body;
    expect(certificate).toEqual(expect.objectContaining(certificate1));

    done();
  });

  it('C.4 should delete a specific certificate', async (done) => {
    let res = await request(server).get('/certificate').expect(HttpStatus.OK);

    let certificates = res.body;
    expect(certificates.length).toBe(3);

    res = await request(server)
      .delete('/certificate/' + certificates[0].id)
      .expect(HttpStatus.OK);
    expect(res.body.id).toBe(certificates[0].id);

    res = await request(server).get('/certificate').expect(HttpStatus.OK);

    certificates = res.body;
    expect(certificates.length).toBe(2);

    done();
  });

  // Negative error testing of endpoints
  it('C.5 shouldn\'t get a specific certificate', async (done) => {
    let res = await request(server).get('/certificate').expect(HttpStatus.OK);

    const certificates = res.body;
    expect(certificates.length).toBe(2);

    res = await request(server)
      .get('/certificate/' + '427f191e810c19729de860ea')
      .expect(HttpStatus.NOT_FOUND);

    done();
  });

  it('C.6 shouldn\'t delete a specific certificate', async (done) => {
    let res = await request(server).get('/certificate').expect(HttpStatus.OK);

    let certificates = res.body;
    expect(certificates.length).toBe(2);

    res = await request(server)
      .delete('/certificate/' + '507f191e810c19729de860ea')
      .expect(HttpStatus.NOT_FOUND);

    expect(certificates.length).toBe(2);

    done();
  });
});
