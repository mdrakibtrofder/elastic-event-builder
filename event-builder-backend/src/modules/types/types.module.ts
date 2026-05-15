import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeEntity } from '../../entities/event-type.entity';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventTypeEntity])],
  providers: [TypesService],
  controllers: [TypesController],
  exports: [TypesService],
})
export class TypesModule {}
