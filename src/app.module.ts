import { Module } from '@nestjs/common';
import { MockManagementModule } from './mock-management/mock-management.module';

@Module({
  imports: [MockManagementModule],
})
export class AppModule {}
