import axios, { AxiosInstance } from 'axios';
import { ServiceMockOptions, ServiceMockInfo } from '../src/types';

describe('Simple flow', () => {
  let id: string;
  const name = 'e2e service mock';
  const port = 10000;

  let client: AxiosInstance;

  beforeAll(() => {
    client = axios.create({ baseURL: 'http://localhost:8080' });
  });

  test('No mocks on init', async () => {
    const response = await client.get('/');
    expect(response.data).toHaveLength(0);
  });

  test('Create service mock', async () => {
    const serviceMockOptions: ServiceMockOptions = { name, port };
    const response = await client.post<{ id: string }>('/', serviceMockOptions);
    expect(response.status).toEqual(201);
    id = response.data.id;
    expect(id).toBeDefined();
  });

  test('Get service mock info', async () => {
    const response = await client.get<ServiceMockInfo>(`/${id}`);
    expect(response.status).toEqual(200);
    expect(response.data).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  // test('Set response', () => {});

  // test('Call service', () => {});

  test('Delete service mock', async () => {
    const response = await client.delete<ServiceMockInfo>(`/${id}`);
    expect(response.status).toEqual(200);
    expect(response.data.id).toEqual(id);
    expect(response.data).toMatchSnapshot({
      id: expect.any(String),
    });
  });
});
