import { Test, TestingModule } from '@nestjs/testing';
import { MockManagementController } from './mock-management.controller';
import { MockManagementService } from './mock-management.service';

describe('Mock Management Controller', () => {
  let controller: MockManagementController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockManagementController],
      providers: [MockManagementService],
    }).compile();

    controller = app.get(MockManagementController);
  });

  test('Empty on init', () => {
    const mocks = controller.getMocks();
    expect(mocks).toHaveLength(0);
  });
});
