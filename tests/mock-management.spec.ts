import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { v4 as uuidV4 } from 'uuid';
import * as Constants from '../src/constants';
import { AppModule } from '../src/app.module';
import { MockManagementService } from '../src/mock-management/mock-management.service';
import { ServiceMock, ServiceMockOptions } from '../src/types';

const createTestServiceMockOptions = (): ServiceMockOptions => ({
  name: 'my service mock',
  port: 3333,
});

const createTestServiceMock = (): ServiceMock => new ServiceMock(createTestServiceMockOptions());

describe('Mock Management', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter(), { logger: true });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('Get all mocks', async () => {
    // Arrange
    const serviceMock = createTestServiceMock();
    const mockManagementService = app.get(MockManagementService);
    jest.spyOn(mockManagementService, 'getMocks').mockReturnValueOnce([serviceMock]);

    // Act
    const response = await app.inject({
      url: '/',
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([serviceMock.info]);
  });

  test('Get mock by id', async () => {
    // Arrange
    const mockManagementService = app.get(MockManagementService);
    const mockService = createTestServiceMock();
    jest.spyOn(mockManagementService, 'getMock').mockReturnValueOnce(mockService);

    // Act
    const response = await app.inject({
      url: `/${mockService.id}`,
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(mockService.info);
  });

  test('Get mock by nonexistent id', async () => {
    // Arrange
    const mockId = uuidV4();
    const mockManagementService = app.get(MockManagementService);
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(mockManagementService, 'getMock').mockReturnValueOnce(undefined);

    // Act
    const response = await app.inject({
      url: `/${mockId}`,
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
    expect(response.json()).toMatchSnapshot();
  });

  test('Create mock', async () => {
    // Arrange
    const serviceMockOptions = createTestServiceMockOptions();
    const id = uuidV4();
    const mockManagementService = app.get(MockManagementService);
    jest.spyOn(mockManagementService, 'createMock').mockReturnValueOnce(id);

    // Act
    const response = await app.inject({
      url: '/',
      method: 'POST',
      payload: serviceMockOptions,
    });

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(response.json()).toEqual({ id });
  });

  test('Create mock with port that is already in use', async () => {
    // Arrange
    const serviceMockOptions = createTestServiceMockOptions();
    const mockManagementService = app.get(MockManagementService);
    jest.spyOn(mockManagementService, 'createMock').mockImplementation(() => {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    });

    // Act
    const response = await app.inject({
      url: '/',
      method: 'POST',
      payload: serviceMockOptions,
    });

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(response.json()).toMatchSnapshot();
  });

  test('Delete mock', async () => {
    // Arrange
    const serviceMock = createTestServiceMock();
    const mockManagementService = app.get(MockManagementService);
    jest.spyOn(mockManagementService, 'deleteMock').mockReturnValueOnce(serviceMock);

    // Act
    const response = await app.inject({
      url: `/${serviceMock.id}`,
      method: 'DELETE',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(serviceMock.info);
  });
});
