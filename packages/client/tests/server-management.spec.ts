import nock from 'nock';
import { v4 as uuidV4 } from 'uuid';
import { createServerManagementClient, ServerManagementClient } from '../src';

describe('Integration: Server Management', () => {
  const baseUrl = 'http://somehost.com:8888';
  let client: ServerManagementClient;
  beforeAll(() => {
    client = createServerManagementClient(baseUrl);
  });

  test('Create server', async () => {
    // Arrange
    const id = uuidV4();
    nock(baseUrl).post('/servers').reply(200, { id });

    // Act
    const response = await client.createFakeServer({ name: 'my fake server', port: 10000 });

    // Assert
    expect(response.id).toEqual(id);
  });
});
