import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventEntity } from '../../entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OrganizationEntity } from '../../entities/organization.entity';
import { LocationEntity } from '../../entities/location.entity';
import { EventTypeEntity } from '../../entities/event-type.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repo: Repository<EventEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly orgRepo: Repository<OrganizationEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,
    @InjectRepository(EventTypeEntity)
    private readonly typeRepo: Repository<EventTypeEntity>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['type', 'organization', 'location', 'collaborators', 'relatedEvents'],
      order: { timestamp: 'ASC' },
    });
  }

  async findOne(id: string) {
    const event = await this.repo.findOne({
      where: { id },
      relations: ['type', 'organization', 'location', 'collaborators', 'relatedEvents'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(dto: CreateEventDto) {
    const { typeId, organizationId, locationId, collaboratorIds, relatedEventIds, ...rest } = dto;

    const event = this.repo.create(rest);

    const type = await this.typeRepo.findOneBy({ id: typeId });
    if (!type) throw new NotFoundException(`Type ${typeId} not found`);
    event.type = type;

    const organization = await this.orgRepo.findOneBy({ id: organizationId });
    if (!organization) throw new NotFoundException(`Organization ${organizationId} not found`);
    event.organization = organization;

    const location = await this.locationRepo.findOneBy({ id: locationId });
    if (!location) throw new NotFoundException(`Location ${locationId} not found`);
    event.location = location;

    if (collaboratorIds?.length) {
      event.collaborators = await this.orgRepo.findBy({ id: In(collaboratorIds) });
    }

    if (relatedEventIds?.length) {
      event.relatedEvents = await this.repo.findBy({ id: In(relatedEventIds) });
    }

    return this.repo.save(event);
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.findOne(id);

    const { typeId, organizationId, locationId, collaboratorIds, relatedEventIds, ...rest } = dto;

    Object.assign(event, rest);

    if (typeId) {
      const type = await this.typeRepo.findOneBy({ id: typeId });
      if (!type) throw new NotFoundException(`Type ${typeId} not found`);
      event.type = type;
    }
    if (organizationId) {
      const organization = await this.orgRepo.findOneBy({ id: organizationId });
      if (!organization) throw new NotFoundException(`Organization ${organizationId} not found`);
      event.organization = organization;
    }
    if (locationId) {
      const location = await this.locationRepo.findOneBy({ id: locationId });
      if (!location) throw new NotFoundException(`Location ${locationId} not found`);
      event.location = location;
    }
    if (collaboratorIds) {
      event.collaborators = await this.orgRepo.findBy({ id: In(collaboratorIds) });
    }
    if (relatedEventIds) {
      event.relatedEvents = await this.repo.findBy({ id: In(relatedEventIds) });
    }

    return this.repo.save(event);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
