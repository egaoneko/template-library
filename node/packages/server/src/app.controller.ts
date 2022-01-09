import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { NoAuth } from 'src/shared/decorators/auth/no-auth';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NoAuth()
  @Get('ping')
  @ApiOperation({ summary: 'ping' })
  ping(): string {
    return this.appService.ping();
  }
}
