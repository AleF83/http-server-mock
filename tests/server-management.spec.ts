import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { v4 as uuidV4 } from 'uuid';
import { CreateFakeServerRequest } from 'http-server-mock-common';
import * as Constants from '../src/constants';
import { AppModule } from '../src/app.module';
import { ServerRepository } from '../src/server-management/server.repository';
import { ServerMock } from '../src/fake-server/fake-server.service';

const createTestServerMockOptions = (): CreateFakeServerRequest => ({
  name: 'my server',
  port: 3333,
});

const createTestServerMock = (): ServerMock => new ServerMock(createTestServerMockOptions());

describe('Server Management', () => {
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

  test('Get all servers', async () => {
    // Arrange
    const fakeServer = createTestServerMock();
    const mockManagementService = app.get(ServerRepository);
    jest.spyOn(mockManagementService, 'getServers').mockReturnValueOnce([fakeServer]);

    // Act
    const response = await app.inject({
      url: '/servers',
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([fakeServer.info]);
  });

  test('Get server by id', async () => {
    // Arrange
    const mockManagementService = app.get(ServerRepository);
    const fakeServer = createTestServerMock();
    jest.spyOn(mockManagementService, 'getServer').mockReturnValueOnce(fakeServer);

    // Act
    const response = await app.inject({
      url: `/servers/${fakeServer.id}`,
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(fakeServer.info);
  });

  test('Get servers by nonexistent id', async () => {
    // Arrange
    const mockId = uuidV4();
    const mockManagementService = app.get(ServerRepository);
    // eslint-disable-next-line unicorn/no-useless-undefined
    jest.spyOn(mockManagementService, 'getServer').mockReturnValueOnce(undefined);

    // Act
    const response = await app.inject({
      url: `/servers/${mockId}`,
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
    expect(response.json()).toMatchSnapshot();
  });

  test('Create server', async () => {
    // Arrange
    const serverMockOptions = createTestServerMockOptions();
    const id = uuidV4();
    const mockManagementService = app.get(ServerRepository);
    jest.spyOn(mockManagementService, 'createServer').mockResolvedValueOnce(id);

    // Act
    const response = await app.inject({
      url: '/servers',
      method: 'POST',
      payload: serverMockOptions,
    });

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(response.json()).toEqual({ id });
  });

  test('Create server that listens to port that is already in use', async () => {
    // Arrange
    const serverMockOptions = createTestServerMockOptions();
    const mockManagementService = app.get(ServerRepository);
    jest.spyOn(mockManagementService, 'createServer').mockImplementation(() => {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    });

    // Act
    const response = await app.inject({
      url: '/servers',
      method: 'POST',
      payload: serverMockOptions,
    });

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(response.json()).toMatchSnapshot();
  });

  test('Delete server', async () => {
    // Arrange
    const fakeServer = createTestServerMock();
    const mockManagementService = app.get(ServerRepository);
    jest.spyOn(mockManagementService, 'deleteServer').mockReturnValueOnce(fakeServer);

    // Act
    const response = await app.inject({
      url: `/servers/${fakeServer.id}`,
      method: 'DELETE',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(fakeServer.info);
  });
});
