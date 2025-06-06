import { Controller, Get } from '@nestjs/common';
import { getEnvironmentConfig } from '../config/environment';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    const config = getEnvironmentConfig();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: '1.0.0',
    };
  }
}
