import axios, { AxiosInstance } from 'axios';

describe('Simple flow', () => {
  let client: AxiosInstance;

  beforeAll(() => {
    client = axios.create({ baseURL: 'http://localhost:8080' });
  });

  test('No mocks on init', async () => {
    const response = await client.get('/');
    expect(response.data).toHaveLength(0);
  });

  // test('Create service mock', async () => {});

  // test('Set response', () => {});

  // test('Call service', () => {});

  // test('Delete service mock', () => {});
});
