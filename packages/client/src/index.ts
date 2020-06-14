import axios from 'axios';
import { ServerManagementClient } from './server-management';
export * from './server-management';
export * from './fake-server';

const DEFAULT_SERVER_MANAGER_PORT = '8080';

export function createServerManagementClient(baseUrl: string): ServerManagementClient {
  const url = new URL(baseUrl);
  if (!url.port) {
    url.port = DEFAULT_SERVER_MANAGER_PORT;
  }
  const axiosInstance = axios.create({ baseURL: `${url.origin}/servers` });
  return new ServerManagementClient(axiosInstance);
}
