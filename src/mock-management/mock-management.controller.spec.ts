import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../constants';
import { ServiceMockOptions, ServiceMock } from '../types';
import { MockManagementController } from './mock-management.controller';
import { MockManagementService } from './mock-management.service';

const createTestServiceMockOptions = (): ServiceMockOptions => ({
  name: 'my service mock',
  port: 3333,
});

const createTestServiceMock = (): ServiceMock => new ServiceMock(createTestServiceMockOptions());

describe('Mock Management Controller', () => {
  let controller: MockManagementController;
  let service: MockManagementService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockManagementController],
      providers: [MockManagementService],
    }).compile();

    controller = app.get(MockManagementController);
    service = app.get(MockManagementService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('Get mocks', () => {
    // Arrange
    const testMock = createTestServiceMock();
    jest.spyOn(service, 'getMocks').mockReturnValueOnce([testMock]);

    // Act
    const mocks = controller.getMocks();

    // Assert
    expect(mocks).toHaveLength(1);
    expect(mocks[0]).toMatchSnapshot({ id: expect.any(String) });
  });

  test('Get mock', () => {
    // Arrange
    const testMock = createTestServiceMock();
    jest.spyOn(service, 'getMock').mockReturnValueOnce(testMock);

    // Act
    const mock = controller.getMock(testMock.id);

    // Assert
    expect(mock).toMatchSnapshot({ id: expect.any(String) });
  });

  test('Get nonexistent mock', () => {
    // Arrange
    const mockId = uuidV4();
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(service, 'getMock').mockReturnValueOnce(undefined);

    // Act
    const shouldThrow = () => controller.getMock(mockId);

    // Assert
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
  });

  test('Create mock', () => {
    // Arrange
    const mockOptions = createTestServiceMockOptions();
    const testMock = new ServiceMock(mockOptions);
    jest.spyOn(service, 'createMock').mockReturnValueOnce(testMock.id);

    // Act
    const mockId = controller.createMock(mockOptions);

    // Assert
    expect(mockId).toEqual({ id: testMock.id });
  });

  test('Create mock with port that already is in use', () => {
    // Arrange
    const mockOptions = createTestServiceMockOptions();
    jest.spyOn(service, 'createMock').mockImplementationOnce(() => {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    });

    // Act
    const shouldThrow = () => controller.createMock(mockOptions);

    // Assert
    expect(shouldThrow).toThrow(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
  });

  test('Create mock throws internal error', () => {
    // Arrange
    const mockOptions = createTestServiceMockOptions();
    const errorMessage = 'Something wrong';
    jest.spyOn(service, 'createMock').mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    // Act
    const shouldThrow = () => controller.createMock(mockOptions);

    // Assert
    expect(shouldThrow).toThrow(errorMessage);
  });

  test('Delete mock', () => {
    // Arrange
    const testMock = createTestServiceMock();
    jest.spyOn(service, 'deleteMock').mockReturnValueOnce(testMock);

    // Act
    const mock = controller.deleteMock(testMock.id);

    // Assert
    expect(mock?.id).toEqual(testMock.id);
  });

  test('Delete nonexisting mock', () => {
    // Arrange
    const mockId = uuidV4();
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(service, 'deleteMock').mockReturnValueOnce(undefined);

    // Act
    const mock = controller.deleteMock(mockId);

    // Assert
    expect(mock).toBeUndefined();
  });
});
