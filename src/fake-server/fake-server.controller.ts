import { Controller, Get } from '@nestjs/common';

@Controller()
export class FakeServerController {
  @Get()
  test(): string {
    return 'Hello, world';
  }
}
