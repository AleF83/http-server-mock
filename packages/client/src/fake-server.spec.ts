import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuidV4 } from 'uuid';
import {
  FakeServerInfo,
  FakeServerStatus,
  RegisterResponseMockRequest,
  RegisterResponseMockResponse,
  FakeServerCall,
} from 'http-server-mock-common';
import { FakeServerClient } from './fake-server';

describe('Fake Server', () => {
  let id: string;
  let mock: MockAdapter;
  let client: FakeServerClient;
  beforeAll(() => {
    id = uuidV4();
    const axiosInstance = axios.create();
    mock = new MockAdapter(axiosInstance);
    client = new FakeServerClient(id, axiosInstance);
  });

  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('Get id', () => {
    // Act
    const serverId = client.id;

    // Assert
    expect(serverId).toEqual(id);
  });

  test('Start server', async () => {
    // Arrange
    mock.onPost(`/${id}/start`).reply(200);

    // Act
    await client.start();

    // Assert
    expect(mock.history.post).toHaveLength(1);
  });

  test('Stop server', async () => {
    // Arrange
    mock.onPost(`/${id}/stop`).reply(200);

    // Act
    await client.stop();

    // Assert
    expect(mock.history.post).toHaveLength(1);
  });

  test('Get server info', async () => {
    // Arrange
    const response: FakeServerInfo = {
      id,
      name: 'my server',
      port: 10000,
      status: FakeServerStatus.Running,
    };
    mock.onGet(`/${id}`).reply(200, response);

    // Act
    const info = await client.getInfo();

    // Assert
    expect(mock.history.get).toHaveLength(1);
    expect(info).toEqual(response);
  });

  test('Register response mock', async () => {
    // Arrange
    const responseMockId = uuidV4();
    const request: RegisterResponseMockRequest = {} as RegisterResponseMockRequest;
    const expectedResponse: RegisterResponseMockResponse = { id: responseMockId };
    mock.onPost(`/${id}/responses`, request).reply(200, expectedResponse);

    // Act
    const response = await client.registerResponseMock(request);

    // Assert
    expect(mock.history.post).toHaveLength(1);
    expect(response).toEqual(expectedResponse);
  });

  test('Unregister response mock', async () => {
    // Arrange
    const responseMockId = uuidV4();
    mock.onDelete(`/${id}/responses/${responseMockId}`).reply(200);

    // Act
    await client.unregisterResponseMock(responseMockId);

    // Assert
    expect(mock.history.delete).toHaveLength(1);
  });

  test('Unregister all response mocks', async () => {
    // Arrange
    mock.onDelete(`/${id}/responses`).reply(200);

    // Act
    await client.unregisterAllResponseMocks();

    // Assert
    expect(mock.history.delete).toHaveLength(1);
  });

  test('Get calls for mock', async () => {
    // Arrange
    const responseMockId = uuidV4();
    const calls: FakeServerCall[] = [];
    mock.onGet(`/${id}/responses/${responseMockId}/calls`).reply(200, calls);

    // Act
    const response = await client.getCalls(responseMockId);

    // Assert
    expect(mock.history.get).toHaveLength(1);
    expect(response).toEqual(calls);
  });

  test('Get all calls', async () => {
    // Arrange
    const calls: FakeServerCall[] = [];
    mock.onGet(`/${id}/calls`).reply(200, calls);

    // Act
    const response = await client.getAllCalls();

    // Assert
    expect(mock.history.get).toHaveLength(1);
    expect(response).toEqual(calls);
  });
});
