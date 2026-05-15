import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventTypeEntity } from '../../entities/event-type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(EventTypeEntity)
    private readonly repo: Repository<EventTypeEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const type = await this.repo.findOne({ where: { id } });
    if (!type) throw new NotFoundException(`Type with ID ${id} not found`);
    return type;
  }

  create(dto: CreateTypeDto) {
    const type = this.repo.create(dto);
    return this.repo.save(type);
  }

  async update(id: string, dto: UpdateTypeDto) {
    const type = await this.findOne(id);
    Object.assign(type, dto);
    return this.repo.save(type);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Type with ID ${id} not found`);
    return { deleted: true };
  }
}
