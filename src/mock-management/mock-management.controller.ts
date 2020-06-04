import { Controller, Get } from '@nestjs/common';
import { MockManagementService } from './mock-management.service';

@Controller()
export class MockManagementController {
  constructor(private readonly _mockManager: MockManagementService) {}

  @Get()
  getMocks(): unknown[] {
    return this._mockManager.getMocks();
  }
}
