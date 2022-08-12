import { Module } from '@nestjs/common';

import { UserService } from '@modules/user/user.service';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
