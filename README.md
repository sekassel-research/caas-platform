# Certification as a Service Monorepo

This repository contains the web frontend and also the NodeJS Backend

## Angular - Frontend (web)

The frontend is created with Angular 11.

To run the application use `npm start`

## NestJS - Backend (srv)

The backend is created with NestJS 7

To run a service use `npm run nx serve xxx` or (if `nx` is installed globally) `nx serve xxx`
For example, to start the `artifact-service` use `nx serve artifact-service`

Available services:
Service | Local Ports
------- | ---------------
artifact-service | 3000
test-suite-service | 3100
certification-service | 3200
job-executor-service | 3300
test-orchestrator-service | 3400

Events produces by services:
Service | Incoming Events | Outgoing Events
------- | --------------- | ---------------
Artifact | CertificateGranted | ArtifactStarted
Test-Suite | ArtifactStarted | TestSuiteStarted
Certification | ArtifactStarted, TestSuiteStarted | CertificateGranted
Job-Executor | JobEvent | JobEvent

## Local dev

The services can run locally, each backend service uses a different port, see `environment/environment.ts` of each service for more information.
You can ether provide a `mongo db` in a docker container or use the `etc/local-docker/docker-compose.yml` to let set up all needed infrastructure services.
You can also use the command `npm run infra`.

docker build --build-arg PROJECT=caas -f Dockerfile.Web -t caas:1.0.0 .

docker build --build-arg PROJECT=artifact-service -f Dockerfile.Node -t art:1.0.0 .
