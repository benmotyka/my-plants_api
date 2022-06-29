import { ForbiddenException } from '@nestjs/common';

export class ExistingUsernameException extends ForbiddenException {
  constructor() {
    super('username-exists');
  }
}
