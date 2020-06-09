import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../constants';
import { ServerMockOptions } from '../types';
import { ServerRepository } from './server.repository';

const createTestServerMockOptions = (name?: string): ServerMockOptions => ({
  name: name || 'my service mock',
  port: 3333,
  startOnInit: false,
});

describe('Server Mock Service', () => {
  let service: ServerRepository;

  beforeEach(() => {
    service = new ServerRepository();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Empty on init', () => {
    // Act
    const mocks = service.getServers();

    // Assert
    expect(mocks).toHaveLength(0);
  });

  test('Create mock', async () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();

    // Act
    const mockId = await service.createServer(mockOptions);

    // Assert
    const mock = service.getServer(mockId);
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(mockOptions.name);
  });

  test('Create mock with part that already in use', async () => {
    // Arrange
    const name1 = 'the first mock';
    const mock1Options = createTestServerMockOptions(name1);
    await service.createServer(mock1Options);

    const name2 = 'the second mock';
    const mock2Options = createTestServerMockOptions(name2);

    // Act
    const shouldReject = service.createServer(mock2Options);

    // Assert
    expect(shouldReject).rejects.toEqual(new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE));
  });

  test('Delete mock', async () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    const mockId = await service.createServer(mockOptions);

    // Act
    const mock = service.deleteServer(mockId);

    // Assert
    expect(mock).toBeDefined();
    expect(mock?.name).toEqual(mockOptions.name);

    const mocks = service.getServers();
    expect(mocks).toHaveLength(0);
  });

  test('Delete nonexisting mock', () => {
    // Arrange
    const mockId = uuidV4();

    // Act
    const mock = service.deleteServer(mockId);

    // Assert
    expect(mock).toBeUndefined();
  });

  test('Start service', async () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    const mockId = await service.createServer(mockOptions);
    const mock = service.getServer(mockId);
    expect(mock).toBeDefined();
    const mockStartStub = jest.spyOn(mock!, 'start');

    mockStartStub.mockImplementationOnce(() => Promise.resolve());

    // Act
    await service.startServer(mockId);

    // Assert
    expect(mockStartStub).toHaveBeenCalled();
  });

  test('Stop service', async () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    const mockId = await service.createServer(mockOptions);
    const mock = service.getServer(mockId);
    expect(mock).toBeDefined();
    const mockStopStub = jest.spyOn(mock!, 'stop');

    mockStopStub.mockImplementationOnce(() => Promise.resolve());

    // Act
    await service.stopServer(mockId);

    // Assert
    expect(mockStopStub).toHaveBeenCalled();
  });
});
