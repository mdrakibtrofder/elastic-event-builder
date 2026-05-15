import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '../../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repo: Repository<LocationEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const loc = await this.repo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException(`Location with ID ${id} not found`);
    return loc;
  }

  create(dto: CreateLocationDto) {
    const loc = this.repo.create(dto);
    return this.repo.save(loc);
  }

  async update(id: string, dto: UpdateLocationDto) {
    const loc = await this.findOne(id);
    Object.assign(loc, dto);
    return this.repo.save(loc);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Location with ID ${id} not found`);
    return { deleted: true };
  }
}
