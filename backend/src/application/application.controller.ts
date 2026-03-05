import { Controller, Get, Post, Patch, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get('status/:referenceNumber')
  getStatus(@Param('referenceNumber') referenceNumber: string) {
    return this.applicationService.getStatus(referenceNumber);
  }

  @Patch('status/:referenceNumber')
  updateStatus(
    @Param('referenceNumber') referenceNumber: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.applicationService.updateStatus(referenceNumber, updateStatusDto);
  }

  @Get()
  getAll() {
    return this.applicationService.getAll();
  }
}
