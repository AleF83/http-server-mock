import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateFakeServerRequest } from 'http-server-mock-common';
import { AppModule } from '../src/app.module';
import { ServerMock } from '../src/fake-server/fake-server.service';
import { ServerRepository } from '../src/server-management/server.repository';

const createTestServerMockOptions = (): CreateFakeServerRequest => ({
  name: 'my server',
  port: 3333,
});

const createTestServerMock = (): ServerMock => new ServerMock(createTestServerMockOptions());

describe('Server Response Management', () => {
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

  test('Check controller', async () => {
    // Arrange
    const mockManagementService = app.get(ServerRepository);
    const fakeServer = createTestServerMock();
    jest.spyOn(mockManagementService, 'getServer').mockReturnValueOnce(fakeServer);

    // Act
    const response = await app.inject({
      url: `/servers/${fakeServer.id}/responses`,
      method: 'GET',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([]);
  });
});
