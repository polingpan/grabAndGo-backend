import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const GetBusinessUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user.userType !== 'business') {
      throw new ForbiddenException('Access restricted to business users.');
    }

    return data ? user?.[data] : user;
  },
);

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);

    if (user.userType !== 'regular') {
      throw new ForbiddenException('Access restricted to regular users.');
    }
    return data ? user?.[data] : user;
  },
);
