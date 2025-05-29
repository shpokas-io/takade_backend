import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    
    // Create a request ID for tracking
    const requestId = Math.random().toString(36).substring(7);

    // Log the incoming request with more details
    this.logger.log(
      `[${requestId}] 🔸 Incoming ${method} ${url}`,
    );
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(
        `[${requestId}] Request Body: ${JSON.stringify(body, null, 2)}`,
      );
    }

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - now;
          
          // Log successful response with emoji indicators
          this.logger.log(
            `[${requestId}] ✅ ${method} ${url} - ${response.statusCode} (${duration}ms)`,
          );
          
          if (data) {
            // Safely stringify the response data
            try {
              const safeData = JSON.stringify(data, (key, value) => {
                if (key === 'password' || key === 'token') return '[REDACTED]';
                return value;
              }, 2);
              this.logger.debug(`[${requestId}] Response Data: ${safeData}`);
            } catch (e) {
              this.logger.debug(`[${requestId}] Response Data: [Complex Object]`);
            }
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          
          // Log errors with more details and emoji indicator
          this.logger.error(
            `[${requestId}] ❌ ${method} ${url} - Failed (${duration}ms)`,
            `Error: ${error.message}`,
          );
          
          if (error.stack) {
            this.logger.debug(`[${requestId}] Stack Trace: ${error.stack}`);
          }
        },
      }),
    );
  }
} 