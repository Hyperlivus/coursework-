import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { User, UserCreationAttributes } from './entry/user.entry';
import { InjectRepository } from '@nestjs/typeorm';
import { EditUserDto } from './dto';
import { hash } from 'bcrypt';
import { authError } from '../auth/errors';
import { userErrors } from './errors';

const NOT_UNIQUE_TAG_CODE = 'UQ_7360583b3b97a10fb0d971bafde';

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

    const newUser = {
      ...user,
      ...updated,
    };

    const updateRes = await this.userRepository.save(newUser).catch((err) => {
      if (err.constraint === NOT_UNIQUE_TAG_CODE)
        return authError.TAG_ALREADY_EXISTS;
      return userErrors.UNKNOWN_EDIT_ERROR;
    });

    if (updateRes instanceof Error) throw updateRes;

    return updateRes;
  }

  async search(query: string) {
    return await this.userRepository.find({
      where: {
        nickname: ILike(`%${query}%`),
        tag: ILike(`%${query}%`),
      },
    });
  }
}
