import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserCreationAttributes } from './entry/user.entry';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOne(attr: UserCreationAttributes) {
    const user = this.userRepository.create(attr);
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async findByEmailOrTag(tagOrEmail: string) {
    return await this.userRepository.findOneBy([
      { email: tagOrEmail },
      { tag: tagOrEmail },
    ]);
  }
}
