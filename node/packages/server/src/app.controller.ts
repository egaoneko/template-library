import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAuth } from '@auth/decorators/auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
