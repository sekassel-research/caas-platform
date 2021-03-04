import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class KafkaExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(KafkaExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const value = host.switchToRpc().getData().value;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object') {
        let msg = 'Bad request: ';
        for (const error of (res as Record<string, string>).message) {
          msg += `${error};`;
        }
        exception.message = msg;
      }
    } else if (exception instanceof RpcException) {
      const errors = exception.getError();
      if (errors instanceof Array) {
        let msg = '';
        for (const error of errors) {
          if (error.constraints) {
            msg += `Error on property '${error.property}' with '${JSON.stringify(error.constraints)}'\n`;
          } else if (error.children) {
            msg += `Error on nested property '${error.property}' with\n`;
            for (const nestedError of error.children) {
              msg += `Error on property '${nestedError.property}' with '${JSON.stringify(nestedError.constraints)}'\n`;
            }
          }
        }
        exception.message = msg;
      }
    }

    exception.message = `${exception.message} => ${JSON.stringify(value)}`;
    exception.stack = '';

    return super.catch(exception, host);
  }
}
