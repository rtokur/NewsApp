import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "src/auth/jwt-payload.interface";

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      if (!request.user) {
        throw new UnauthorizedException('User not found in request');
      }
      return request.user;
    },
  );
  