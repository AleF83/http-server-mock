import fastify from 'fastify';
import { ServiceBase, ServiceConfig } from './serviceBase';

class TestService extends ServiceBase {
  constructor(config: ServiceConfig) {
    super(config);
  }
}

describe('Service Base', () => {
  const server = fastify();
  let service: ServiceBase;

  beforeAll(() => {
    service = new TestService({ name: 'test', port: 8080, server });
  });

  afterAll(async () => {
    await service.stop();
  });

  test('Is healthy', async () => {
    expect(service).toBeDefined();

    const healthRes = await server.inject({
      url: '/health',
    });

    expect(healthRes.body).toEqual('Healthy');
  });
});
