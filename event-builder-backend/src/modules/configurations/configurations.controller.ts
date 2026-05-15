import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly service: ConfigurationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.service.findOne(key);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateConfigurationDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':key')
  update(@Param('key') key: string, @Body() dto: UpdateConfigurationDto) {
    return this.service.update(key, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.service.remove(key);
  }
}
