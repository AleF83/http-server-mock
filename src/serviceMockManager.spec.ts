import { ServiceMockManager } from './serviceMockManager';

describe('Service Mock Manager', () => {
  const serviceMockManager = new ServiceMockManager();
  let serviceMockId: string;

  test('Empty on init', () => {
    const result = serviceMockManager.getServiceMocks();
    expect(result).toHaveLength(0);
  });

  test('Create new service mock', () => {
    serviceMockId = serviceMockManager.createServiceMock({
      name: 'my_service_mock',
      port: 8080,
    });

    const result = serviceMockManager.getServiceMocks();
    expect(result).toHaveLength(1);
    const serviceMock = result[0];
    expect(serviceMock.id).toEqual(serviceMockId);
  });

  test('Delete service mock', async () => {
    await serviceMockManager.deleteServiceMock(serviceMockId);

    const result = serviceMockManager.getServiceMocks();
    expect(result).toHaveLength(0);
  });
});
