import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { NoAuth } from '@root/shared/decorators/auth/no-auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';

@ApiTags('app')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly config: ConfigService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly db: SequelizeHealthIndicator,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {}

  @NoAuth()
  @ApiOperation({ summary: 'health check' })
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const host = this.config.get<string>('http.host') ?? '';
    const port = this.config.get<number>('http.port') ?? '';

    return this.health.check([
      () => this.http.pingCheck('docs', `${host}:${port}/docs`),
      () => this.db.pingCheck('database', { connection: this.sequelize }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }
}
