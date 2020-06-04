import { MockManagementService } from './mock-management.service';

describe('Mock Management Service', () => {
  let service: MockManagementService;

  beforeAll(() => {
    service = new MockManagementService();
  });

  test('Empty on init', () => {
    const mocks = service.getMocks();
    expect(mocks).toHaveLength(0);
  });
});
