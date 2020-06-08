import { Module } from '@nestjs/common';
import { ServerManagementModule } from '../server-management/server-management.module';
import { ServerResponseController } from './server-response.controller';

@Module({
  imports: [ServerManagementModule],
  controllers: [ServerResponseController],
  providers: [],
})
export class ServerResponseModule {}
