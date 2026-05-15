import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuilderConfigurationEntity } from '../../entities/builder-configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(BuilderConfigurationEntity)
    private readonly repo: Repository<BuilderConfigurationEntity>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(key: string) {
    const config = await this.repo.findOneBy({ key });
    if (!config) throw new NotFoundException(`Configuration with key ${key} not found`);
    return config;
  }

  async create(dto: CreateConfigurationDto) {
    const config = this.repo.create(dto);
    return this.repo.save(config);
  }

  async update(key: string, dto: UpdateConfigurationDto) {
    const config = await this.findOne(key);
    Object.assign(config, dto);
    return this.repo.save(config);
  }

  async remove(key: string) {
    const result = await this.repo.delete({ key });
    if (result.affected === 0) throw new NotFoundException(`Configuration with key ${key} not found`);
    return { deleted: true };
  }
}
