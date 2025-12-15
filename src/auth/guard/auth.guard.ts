import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { UserPayload } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entry/user.entry';

export const AuthRequired = Reflector.createDecorator<boolean>();

export interface AuthorizedRequest {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isAuthRequired = this.reflector.get(
      AuthRequired,
      context.getHandler(),
    );
    if (!isAuthRequired) return true;

    const http = context.switchToHttp();
    const request = http.getRequest();
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader === undefined) throw new UnauthorizedException();

    const payload = await this.validateHeader(authorizationHeader);
    const user = await this.userService.findById(payload.id);
    if (user === null) throw new UnauthorizedException();
    if (user.password !== payload.password) throw new UnauthorizedException();

    request.user = user;
    return true;
  }

  async validateHeader(authHeader: string) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer') throw new UnauthorizedException();
    const userPayloadValidationResult = await this.jwtService
      .verifyAsync<UserPayload>(token)
      .catch(() => new UnauthorizedException());

    if (userPayloadValidationResult instanceof UnauthorizedException) {
      throw userPayloadValidationResult;
    }

    return userPayloadValidationResult;
  }
}
