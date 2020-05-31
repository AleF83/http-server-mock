import fastify from 'fastify';
import { AdminService } from './adminService';
import { ServiceMockInfo } from './serviceMock';
import { ServiceConfig } from './serviceBase';

describe('Admin Service', () => {
  const server = fastify();
  let service: AdminService;
  let serviceMockId: string;

  beforeAll(() => {
    service = new AdminService({ name: 'admin', port: 3000, server });
  });

  afterAll(() => {
    service.stop();
  });

  test('Empty on init', async () => {
    const response = await server.inject({
      url: '/admin',
      method: 'GET',
    });

    const serviceMocks: ServiceMockInfo[] = response.json();
    expect(serviceMocks).toHaveLength(0);
  });

  test('Create new service mock', async () => {
    const payload: ServiceConfig = {
      name: 'my-service-mock',
      port: 2999,
    };

    const createResponse = await server.inject({
      url: '/admin',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      payload,
    });
    expect(createResponse.statusCode).toEqual(200);

    serviceMockId = createResponse.json().Id;

    const response = await server.inject({
      url: '/admin',
      method: 'GET',
    });

    const serviceMocks: ServiceMockInfo[] = response.json();
    expect(serviceMocks).toHaveLength(1);
    const serviceMockInfo = serviceMocks[0];
    expect(serviceMockInfo.id).toEqual(serviceMockId);
  });

  test('Delete service mock', async () => {
    const deleteResponse = await server.inject({
      url: `/admin/${serviceMockId}`,
      method: 'DELETE',
    });
    expect(deleteResponse.statusCode).toEqual(200);

    const response = await server.inject({
      url: '/admin',
      method: 'GET',
    });

    const serviceMocks: ServiceMockInfo[] = response.json();
    expect(serviceMocks).toHaveLength(0);
  });
});
