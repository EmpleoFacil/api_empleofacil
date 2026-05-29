import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev_secret',
    });
  }

  validate(payload: { sub: string; role: string; companyId?: string; candidateId?: string }) {
    return {
      id: payload.sub,
      role: payload.role,
      companyId: payload.companyId,
      candidateId: payload.candidateId,
    };
  }
}
