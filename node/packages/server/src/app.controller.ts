import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAuth } from '@auth/decorators/auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('common')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NoAuth()
  @Get('ping')
  @ApiOperation({ summary: 'health check' })
  ping(): string {
    return this.appService.ping();
  }
}
