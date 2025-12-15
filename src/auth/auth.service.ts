import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO, RegisterDTO } from './dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entry/user.entry';
import { QueryFailedError } from 'typeorm';
import {
  LOGIN_ERROR,
  UNDEFINED_AUTH_ERROR,
  USER_WITH_EMAIL_ALREADY_EXISTS,
  USER_WITH_TAG_ALREADY_EXISTS_SUCCESS,
} from './errors';

const NOT_UNIQUE_EMAIL_CODE = '';
const NOT_UNIQUE_TAG_CODE = '';

export interface UserPayload {
  id: number;
  email: string;
  tag: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly jwtService: JwtService,
  ) {}

  async generateToken(user: User) {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      tag: user.tag,
      password: user.password,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDTO) {
    const hashPassword = await hash(dto.password, 10);
    const attributes = {
      ...dto,
      password: hashPassword,
    };

    const userCreationResult = await this.userService
      .createOne(attributes)
      .catch((err: QueryFailedError) => {
        const code = (err as any).code;
        if (code === NOT_UNIQUE_EMAIL_CODE)
          return USER_WITH_EMAIL_ALREADY_EXISTS;

        if (code === NOT_UNIQUE_TAG_CODE)
          return USER_WITH_TAG_ALREADY_EXISTS_SUCCESS;

        return UNDEFINED_AUTH_ERROR;
      });

    if (userCreationResult instanceof Error) {
      throw userCreationResult;
    }

    return this.generateToken(userCreationResult);
  }

  async login(dto: LoginDTO) {
    const user = await this.userService.findByEmailOrTag(dto.emailOrTag);
    if (!user) throw new UnauthorizedException();

    if (!(await compare(dto.password, user.password))) throw LOGIN_ERROR;

    return user;
  }
}
