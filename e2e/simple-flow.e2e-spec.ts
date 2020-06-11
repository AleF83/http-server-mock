import { CreateFakeServerRequest, RegisterResponseMockRequest } from 'http-server-mock-common';
import { createServerManagementClient, ServerManagerClient, FakeServerClient } from 'http-server-mock-client';
import axios from 'axios';

describe('Simple flow', () => {
  const name = 'e2e service mock';
  const port = 10000;

  let serverManagementClient: ServerManagerClient;
  let fakeServerClient: FakeServerClient;

  beforeAll(() => {
    serverManagementClient = createServerManagementClient('http://localhost:8080');
  });

  test('No servers on init', async () => {
    const servers = await serverManagementClient.listFakeServers();
    expect(servers).toHaveLength(0);
  });

  test('Create fake server', async () => {
    const fakeServerOptions: CreateFakeServerRequest = { name, port, startOnInit: false };
    fakeServerClient = await serverManagementClient.createFakeServer(fakeServerOptions);
    expect(fakeServerClient).toBeDefined();
  });

  test('Get fake-server info', async () => {
    const response = await fakeServerClient.getInfo();
    expect(response).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  test('Start fake-server', async () => {
    await fakeServerClient.start();
  });

  test('Set response', async () => {
    const request: RegisterResponseMockRequest = {
      requestMatcher: {},
      expectedResponse: {},
    };
    const response = await fakeServerClient.registerResponseMock(request);
    expect(response).toBeDefined();
  });

  test('Call service', async () => {
    const response = await axios.get(`http://localhost:10000`);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('Hello, world');
  });

  test('Stop fake-server', async () => {
    await fakeServerClient.stop();
  });

  test('Delete fake server', async () => {
    await serverManagementClient.deleteFakeServer(fakeServerClient.id);
  });
});
