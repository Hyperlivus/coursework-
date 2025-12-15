import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it(`
  CASE: user enters valid data while registration
  EXPECT: return jwt token
  `, async () => {
    const res = await service.register({
      password: 'PIequals31414',
      nickname: 'SimpleUser',
      tag: 'simple_user_1',
      email: 'simpleEmail@gmail.com',
    });

    expect(res).toBe({
      token: expect.any(String),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
