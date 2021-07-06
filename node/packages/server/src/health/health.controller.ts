import {
  Controller,
  Get
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  SequelizeHealthIndicator
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { NoAuth } from '@auth/decorators/auth';
import {
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/sequelize';
import { DEFAULT_DATABASE_NAME } from '@config/constants/database';
import { Sequelize } from 'sequelize';
import path from 'path';

@ApiTags('app')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly config: ConfigService,
    private readonly db: SequelizeHealthIndicator,
    @InjectConnection(DEFAULT_DATABASE_NAME)
    private readonly sequelize: Sequelize,
  ) {
  }

  @NoAuth()
  @ApiOperation({ summary: 'health check' })
  @Get()
  @HealthCheck()
  check() {
    const host = this.config.get<string>('http.host') ?? '';
    const port = this.config.get<number>('http.port') ?? '';

    console.log(path.join(__dirname));
    return this.health.check([
      () => this.http.pingCheck('docs', `${host}:${port}/docs`),
      () => this.db.pingCheck('database', { connection: this.sequelize }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }
}
