export abstract class Constants {
    // Regex
    static readonly REGEX_VERSION_FORMAT = /\d+\.\d+\.\d+/;
    static readonly REGEX_DOCKER_TAG = /([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/;

    // Kafka Constants
    static readonly KAFKA_JOB_FINISHED = 'jobfinished';
    static readonly KAFKA_JOB_EXECUTE = 'jobexecute';
    static readonly KAFKA_CERTIFICATION = 'certification';
}