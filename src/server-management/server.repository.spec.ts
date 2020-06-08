import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../constants';
import { ServerMockOptions } from '../types';
import { ServerRepository } from './server.repository';

describe('Server Mock Service', () => {
  let service: ServerRepository;

  beforeEach(() => {
    service = new ServerRepository();
  });

  test('Empty on init', () => {
    const mocks = service.getServers();
    expect(mocks).toHaveLength(0);
  });

  test('Create mock', () => {
    const name = 'unit-test-mock';
    const mockOptions: ServerMockOptions = {
      name,
      port: 8080,
    };
    const mockId = service.createServer(mockOptions);

    const mock = service.getServer(mockId);
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(name);
  });

  test('Create mock with part that already in use', () => {
    const name1 = 'the first mock';
    const mock1Options: ServerMockOptions = {
      name: name1,
      port: 8080,
    };
    service.createServer(mock1Options);

    const name2 = 'the second mock';
    const mock2Options: ServerMockOptions = {
      name: name2,
      port: 8080,
    };
    const shouldThrow = () => {
      service.createServer(mock2Options);
    };
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
  });

  test('Delete mock', () => {
    const name = 'unit-test-mock';
    const mockOptions: ServerMockOptions = {
      name,
      port: 8080,
    };
    const mockId = service.createServer(mockOptions);

    const mock = service.deleteServer(mockId);
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(name);

    const mocks = service.getServers();
    expect(mocks).toHaveLength(0);
  });

  test('Delete nonexisting mock', () => {
    const mockId = uuidV4();
    const mock = service.deleteServer(mockId);
    expect(mock).toBeUndefined();
  });
});
