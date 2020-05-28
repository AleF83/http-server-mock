import startServer from '../src/server';
import fastify from 'fastify';

describe('Sample test', () => {
  let server: fastify.FastifyInstance;

  beforeAll(() => {
    server = startServer();
  });

  afterAll(async () => {
    await server.close();
  });

  test('First test', async () => {
    const response = await server.inject({
      url: '/',
      method: 'GET',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('OK');
  });
});
