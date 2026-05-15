import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuilderConfigurationEntity } from '../../entities/builder-configuration.entity';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BuilderConfigurationEntity])],
  providers: [ConfigurationsService],
  controllers: [ConfigurationsController],
})
export class ConfigurationsModule {}
