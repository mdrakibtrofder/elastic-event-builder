import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEntity } from '../../entities/attendee.entity';
import { EventEntity } from '../../entities/event.entity';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttendeeEntity, EventEntity])],
  providers: [AttendeesService],
  controllers: [AttendeesController],
})
export class AttendeesModule {}
