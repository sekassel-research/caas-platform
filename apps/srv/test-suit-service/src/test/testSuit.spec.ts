import { HttpStatus, INestApplication } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';

import { MongoMemoryServer } from 'mongodb-memory-server'

import { ConfigModule } from '@caas/srv/config';

import { TestSuitsModule } from '../app/testSuit'
import { AuthMiddlewareMock } from './auth.middleware.mock'

import bodyParser = require('body-parser');
import express = require('express');
import request = require('supertest');

const testSuit1 = {
    name: 'MyFirstService',
    version: '1.0.0',
    dockerImage: 'reg/my-fir-service:1.0.0',
};

const testSuit2 = {
    name: 'MySecondService',
    version: '1.0.2',
    dockerImage: 'reg/my-sec-service:1.0.2',
};

const testSuit3 = {
    name: 'MyThirdService',
    version: '1.1.0',
    dockerImage: 'reg/my-thi-service:1.1.0',
};

describe('TestSuits', () => {
    let app: INestApplication;
    let mongod: MongoMemoryServer;
    const server = express();
    server.use(bodyParser.json());

    beforeAll(async () => {
        mongod = new MongoMemoryServer();
        const mongoUri = process.env.MONGO_URI || (await mongod.getUri());

        const module = await Test.createTestingModule({
            imports: [
                TestSuitsModule,
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

    it('A.1 should create new testSuits', async (done) => {
        await request(server).post('/testSuit').send(testSuit1).expect(HttpStatus.CREATED);
        await request(server).post('/testSuit').send(testSuit2).expect(HttpStatus.CREATED);
        await request(server).post('/testSuit').send(testSuit3).expect(HttpStatus.CREATED);

        done();
    });

    it('A.2 should get a list of all testSuits', async (done) => {
        const res = await request(server).get('/testSuit').expect(HttpStatus.OK);

        const testSuits = res.body;
        expect(testSuits.length).toBe(3);
        expect(testSuits[0]).toEqual(expect.objectContaining(testSuit1));
        expect(testSuits[1]).toEqual(expect.objectContaining(testSuit2));
        expect(testSuits[2]).toEqual(expect.objectContaining(testSuit3));

        done();
    });

    it('A.3 should get a specific testSuit', async (done) => {
        let res = await request(server).get('/testSuit').expect(HttpStatus.OK);

        const testSuits = res.body;
        expect(testSuits.length).toBe(3);

        res = await request(server)
            .get('/testSuit/' + testSuits[0].id)
            .expect(HttpStatus.OK);

        const testSuit = res.body;
        expect(testSuit).toEqual(expect.objectContaining(testSuit1));

        done();
    });

    it('A.4 should update a specific testSuit', async (done) => {
        let res = await request(server).get('/testSuit').expect(HttpStatus.OK);

        const testSuits = res.body;
        expect(testSuits.length).toBe(3);

        const previousTestSuit = testSuits[0];

        res = await request(server)
            .put('/testSuit/' + testSuits[0].id)
            .send({ ...testSuit1, name: 'updatedName', version: '1.1.0' })
            .expect(HttpStatus.OK);

        const testSuit = res.body;
        expect(previousTestSuit.id).toEqual(testSuit.id)
        expect(testSuit).toEqual(expect.objectContaining({ ...testSuit1, name: 'updatedName', version: '1.1.0' }));

        done();
    });

    it('A.5 should delete a specific testSuit', async (done) => {
        let res = await request(server).get('/testSuit').expect(HttpStatus.OK);

        let testSuits = res.body;
        expect(testSuits.length).toBe(3);

        res = await request(server)
            .delete('/testSuit/' + testSuits[0].id)
            .expect(HttpStatus.OK);
        expect(res.body.id).toBe(testSuits[0].id);

        res = await request(server).get('/testSuit').expect(HttpStatus.OK);

        testSuits = res.body;
        expect(testSuits.length).toBe(2);

        done();
    });
});