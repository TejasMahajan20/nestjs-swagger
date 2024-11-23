import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  @ApiOperation({
    summary: 'Check health of api',
    description: 'This endpoint will check health of api.'
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Service is healthly." })
  health(): string {
    return this.appService.health();
  }
}
