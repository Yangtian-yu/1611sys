import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "duty-system-secret",
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] validate 被调用, payload:', JSON.stringify(payload));
    const user = await this.authService.validateUser(payload.sub);
    console.log('[JwtStrategy] validateUser 返回:', JSON.stringify(user));
    return user;
  }
}
