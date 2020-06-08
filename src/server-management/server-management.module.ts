import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerRepository } from './server.repository';

@Module({
  imports: [],
  controllers: [ServerController],
  providers: [ServerRepository],
  exports: [ServerRepository],
})
export class ServerManagementModule {}
