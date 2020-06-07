import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../constants';
import { ServiceMockOptions } from '../types';
import { MockManagementService } from './mock-management.service';

describe('Mock Management Service', () => {
  let service: MockManagementService;

  beforeEach(() => {
    service = new MockManagementService();
  });

  test('Empty on init', () => {
    const mocks = service.getMocks();
    expect(mocks).toHaveLength(0);
  });

  test('Create mock', () => {
    const name = 'unit-test-mock';
    const mockOptions: ServiceMockOptions = {
      name,
      port: 8080,
    };
    const mockId = service.createMock(mockOptions);

    const mock = service.getMock(mockId);
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(name);
  });

  test('Create mock with part that already in use', () => {
    const name1 = 'the first mock';
    const mock1Options: ServiceMockOptions = {
      name: name1,
      port: 8080,
    };
    service.createMock(mock1Options);

    const name2 = 'the second mock';
    const mock2Options: ServiceMockOptions = {
      name: name2,
      port: 8080,
    };
    const shouldThrow = () => {
      service.createMock(mock2Options);
    };
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
  });

  test('Delete mock', () => {
    const name = 'unit-test-mock';
    const mockOptions: ServiceMockOptions = {
      name,
      port: 8080,
    };
    const mockId = service.createMock(mockOptions);

    const mock = service.deleteMock(mockId);
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(name);

    const mocks = service.getMocks();
    expect(mocks).toHaveLength(0);
  });

  test('Delete nonexisting mock', () => {
    const mockId = uuidV4();
    const mock = service.deleteMock(mockId);
    expect(mock).toBeUndefined();
  });
});
