import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../../entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly repo: Repository<OrganizationEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const org = await this.repo.findOne({ where: { id } });
    if (!org) throw new NotFoundException(`Organization with ID ${id} not found`);
    return org;
  }

  create(dto: CreateOrganizationDto) {
    const org = this.repo.create(dto);
    return this.repo.save(org);
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    Object.assign(org, dto);
    return this.repo.save(org);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Organization with ID ${id} not found`);
    return { deleted: true };
  }
}
