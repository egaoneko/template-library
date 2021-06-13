import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAuth } from '@auth/decorators/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NoAuth()
  @Get('ping')
  ping(): string {
    return this.appService.ping();
  }
}
