import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
import MockAdapter from 'axios-mock-adapter';
import {
  FakeServerInfo,
  FakeServerStatus,
  CreateFakeServerRequest,
  CreateFakeServerResponse,
} from 'http-server-mock-common';
import { ServerManagementClient } from './server-management';

describe('Server Management', () => {
  let client: ServerManagementClient;
  let mock: MockAdapter;

  beforeEach(() => {
    const axiosInstance = axios.create();
    mock = new MockAdapter(axiosInstance);
    client = new ServerManagementClient(axiosInstance);
  });

  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('List fake servers', async () => {
    // Arrange
    mock.onGet('').reply(200, []);

    // Act
    const response = await client.listFakeServers();

    // Assert
    expect(mock.history.get).toHaveLength(1);
    expect(response).toHaveLength(0);
  });

  test('Get client', async () => {
    // Arrange
    const id = uuidV4();
    const info: FakeServerInfo = {
      id,
      name: 'my server',
      port: 1000,
      status: FakeServerStatus.Running,
    };
    mock.onGet(`/${id}`).reply(200, info);

    // Act
    const response = await client.getFakeServerClient(id);

    // Assert
    expect(mock.history.get).toHaveLength(1);
    expect(response.id).toEqual(info.id);
  });

  test('Create fake server', async () => {
    // Arrange
    const request: CreateFakeServerRequest = {
      name: 'my server',
      port: 1000,
    };
    const expectedResponse: CreateFakeServerResponse = {
      id: uuidV4(),
      status: FakeServerStatus.Running,
    };
    mock.onPost('', request).reply(200, expectedResponse);

    // Act
    const response = await client.createFakeServer(request);

    // Assert
    expect(mock.history.post).toHaveLength(1);
    expect(response.id).toEqual(expectedResponse.id);
  });

  test('Delete fake server', async () => {
    // Arrange
    const id = uuidV4();
    mock.onDelete(`/${id}`).reply(200);

    // Act
    await client.deleteFakeServer(id);

    // Assert
    expect(mock.history.delete).toHaveLength(1);
  });
});
