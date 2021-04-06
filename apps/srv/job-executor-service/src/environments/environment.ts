export const environment = {
  production: false,
  port: 3300,
  auth: {
    resource: 'job-executor-service'
  },
  mongo: {},
  kafka: {
    clientId: 'job-executor-service',
  },

  REGEX_VERSION_FORMAT: /\d+\.\d+\.\d+/,
  REGEX_DOCKER_TAG: /([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/,

  KAFKA_JOB_FINISHED: 'jobfinished',
  KAFKA_JOB_EXECUTE: 'jobexecute',
  KAFKA_CERTIFICATION: 'certification',
};
