import fastify from 'fastify';
import { ServiceMock } from './serviceMock';
import { ServiceBase } from './serviceBase';

describe('Service Mock', () => {
  const server = fastify();
  let service: ServiceBase;

  beforeAll(() => {
    service = new ServiceMock({ name: 'test', port: 8080, server });
  });

  afterAll(async () => {
    await service.stop();
  });

  test('Sample test', () => {
    expect(service).toBeDefined();
  });
});
