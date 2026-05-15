import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../entities/event.entity';
import { OrganizationEntity } from '../../entities/organization.entity';
import { LocationEntity } from '../../entities/location.entity';
import { EventTypeEntity } from '../../entities/event-type.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      OrganizationEntity,
      LocationEntity,
      EventTypeEntity,
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
