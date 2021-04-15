export const environment = {
  production: false,
  port: 3100,
  auth: {
    resource: 'test-suite-service',
  },
  mongo: {},
  kafka: {
    clientId: 'test-suite-service',
  },

  REGEX_VERSION_FORMAT: /\d+\.\d+\.\d+/,
  REGEX_DOCKER_TAG: /([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/,

  KAFKA_JOB_FINISHED: 'jobfinished',
  KAFKA_JOB_EXECUTE: 'jobexecute',
  KAFKA_CERTIFICATION: 'certification',
};
