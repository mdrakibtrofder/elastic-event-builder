import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendeeEntity } from '../../entities/attendee.entity';
import { EventEntity } from '../../entities/event.entity';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(AttendeeEntity)
    private readonly repo: Repository<AttendeeEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['event'] });
  }

  async findOne(id: string) {
    const attendee = await this.repo.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!attendee) throw new NotFoundException(`Attendee with ID ${id} not found`);
    return attendee;
  }

  async create(dto: CreateAttendeeDto) {
    const { eventId, ...rest } = dto;
    const attendee = this.repo.create(rest);
    
    if (eventId) {
      const event = await this.eventRepo.findOneBy({ id: eventId });
      if (!event) throw new NotFoundException(`Event with ID ${eventId} not found`);
      attendee.event = event;
    }

    return this.repo.save(attendee);
  }

  async update(id: string, dto: UpdateAttendeeDto) {
    const attendee = await this.findOne(id);
    const { eventId, ...rest } = dto;

    Object.assign(attendee, rest);

    if (eventId) {
      const event = await this.eventRepo.findOneBy({ id: eventId });
      if (!event) throw new NotFoundException(`Event with ID ${eventId} not found`);
      attendee.event = event;
    }

    return this.repo.save(attendee);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Attendee with ID ${id} not found`);
    return { deleted: true };
  }
}
