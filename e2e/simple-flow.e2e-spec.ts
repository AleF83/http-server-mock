import axios, { AxiosInstance } from 'axios';
import { ServerMockOptions, ServerMockInfo } from '../src/types';

describe('Simple flow', () => {
  let id: string;
  const name = 'e2e service mock';
  const port = 10000;

  let client: AxiosInstance;
  let fakeServerClient: AxiosInstance;

  beforeAll(() => {
    client = axios.create({ baseURL: 'http://localhost:8080' });
    fakeServerClient = axios.create({ baseURL: `http://localhost:${port}` });
  });

  test('No servers on init', async () => {
    const response = await client.get('/servers');
    expect(response.data).toHaveLength(0);
  });

  test('Create fake server', async () => {
    const serverMockOptions: ServerMockOptions = { name, port, startOnInit: false };
    const response = await client.post<{ id: string }>('/servers', serverMockOptions);
    expect(response.status).toEqual(201);
    id = response.data.id;
    expect(id).toBeDefined();
  });

  test('Get fake-server info', async () => {
    const response = await client.get<ServerMockInfo>(`/servers/${id}`);
    expect(response.status).toEqual(200);
    expect(response.data).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  test('Start fake-server', async () => {
    const response = await client.post<void>(`/servers/${id}/start`);
    expect(response.status).toEqual(200);
  });

  // test('Set response', () => {});

  test('Call service', async () => {
    const response = await fakeServerClient.get('/');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('Hello, world');
  });

  test('Stop fake-server', async () => {
    const response = await client.post<void>(`/servers/${id}/stop`);
    expect(response.status).toEqual(200);
  });

  test('Delete fake server', async () => {
    const response = await client.delete<ServerMockInfo>(`/servers/${id}`);
    expect(response.status).toEqual(200);
    expect(response.data.id).toEqual(id);
    expect(response.data).toMatchSnapshot({
      id: expect.any(String),
    });
  });
});
