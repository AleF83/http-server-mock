import { Module } from '@nestjs/common';
import { ServerManagementModule } from './server-management/server-management.module';
import { ServerResponseModule } from './server-responses/server-response.module';

@Module({
  imports: [ServerManagementModule, ServerResponseModule],
})
export class AppModule {}
