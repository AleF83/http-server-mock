import { Module } from '@nestjs/common';
import { MockManagementController } from './mock-management.controller';
import { MockManagementService } from './mock-management.service';

@Module({
  imports: [],
  controllers: [MockManagementController],
  providers: [MockManagementService],
})
export class MockManagementModule {}
