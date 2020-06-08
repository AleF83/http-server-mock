import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../constants';
import { ServerMockOptions } from '../types';
import { ServerMock } from '../fake-server/fake-server.service';
import { ServerController } from './server.controller';
import { ServerRepository } from './server.repository';

const createTestServerMockOptions = (): ServerMockOptions => ({
  name: 'my service mock',
  port: 3333,
});

const createTestServerMock = (): ServerMock => new ServerMock(createTestServerMockOptions());

describe('Server Mock Controller', () => {
  let controller: ServerController;
  let service: ServerRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerRepository],
    }).compile();

    controller = app.get(ServerController);
    service = app.get(ServerRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('Get mocks', () => {
    // Arrange
    const testMock = createTestServerMock();
    jest.spyOn(service, 'getServers').mockReturnValueOnce([testMock]);

    // Act
    const mocks = controller.getServers();

    // Assert
    expect(mocks).toHaveLength(1);
    expect(mocks[0]).toMatchSnapshot({ id: expect.any(String) });
  });

  test('Get mock', () => {
    // Arrange
    const testMock = createTestServerMock();
    jest.spyOn(service, 'getServer').mockReturnValueOnce(testMock);

    // Act
    const mock = controller.getServer(testMock.id);

    // Assert
    expect(mock).toMatchSnapshot({ id: expect.any(String) });
  });

  test('Get nonexistent mock', () => {
    // Arrange
    const mockId = uuidV4();
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(service, 'getServer').mockReturnValueOnce(undefined);

    // Act
    const shouldThrow = () => controller.getServer(mockId);

    // Assert
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
  });

  test('Create mock', () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    const testMock = new ServerMock(mockOptions);
    jest.spyOn(service, 'createServer').mockReturnValueOnce(testMock.id);

    // Act
    const mockId = controller.createServer(mockOptions);

    // Assert
    expect(mockId).toEqual({ id: testMock.id });
  });

  test('Create mock with port that already is in use', () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    jest.spyOn(service, 'createServer').mockImplementationOnce(() => {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    });

    // Act
    const shouldThrow = () => controller.createServer(mockOptions);

    // Assert
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
  });

  test('Create mock throws internal error', () => {
    // Arrange
    const mockOptions = createTestServerMockOptions();
    const errorMessage = 'Something wrong';
    jest.spyOn(service, 'createServer').mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    // Act
    const shouldThrow = () => controller.createServer(mockOptions);

    // Assert
    expect(shouldThrow).toThrow(errorMessage);
  });

  test('Delete mock', () => {
    // Arrange
    const testMock = createTestServerMock();
    jest.spyOn(service, 'deleteServer').mockReturnValueOnce(testMock);

    // Act
    const mock = controller.deleteServer(testMock.id);

    // Assert
    expect(mock?.id).toEqual(testMock.id);
  });

  test('Delete nonexisting mock', () => {
    // Arrange
    const mockId = uuidV4();
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(service, 'deleteServer').mockReturnValueOnce(undefined);

    // Act
    const mock = controller.deleteServer(mockId);

    // Assert
    expect(mock).toBeUndefined();
  });
});
