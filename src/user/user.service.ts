import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserCreationAttributes } from './entry/user.entry';
import { InjectRepository } from '@nestjs/typeorm';
import { EditUserDto } from './dto';
import { hash } from 'bcrypt';

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

  async edit(user: User, dto: EditUserDto) {
    const updated = { ...dto };

    if (dto.password) {
      updated.password = await hash(dto.password, 10);
    }
    return await this.userRepository.update(user, updated);
  }
}
