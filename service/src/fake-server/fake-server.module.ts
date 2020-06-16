import { Module } from '@nestjs/common';
import { FakeServerController } from './fake-server.controller';

@Module({
  imports: [],
  controllers: [FakeServerController],
  providers: [],
})
export class FakeServerModule {}
