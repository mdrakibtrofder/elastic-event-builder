import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findOne(username: string): Promise<UserEntity | null> {
    return this.repo.findOneBy({ username });
  }

  async create(username: string, passwordHash: string): Promise<UserEntity> {
    const user = this.repo.create({ username, passwordHash });
    return this.repo.save(user);
  }
}
