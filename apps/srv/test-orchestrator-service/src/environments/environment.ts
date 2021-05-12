export const environment = {
  production: false,
  port: 3400,
  auth: {
    resource: 'test-orchestrator-service',
  },
  mongo: {},
  kafka: {
    clientId: 'test-orchestrator-service',
  },

  KAFKA_START_PIPELINE: 'startpipeline',
};
