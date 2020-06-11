import { ServerManagerClient } from './server-management';
export * from './server-management';
export * from './fake-server';

const DEFAULT_SERVER_MANAGER_PORT = '8080';

export function createServerManagementClient(baseUrl: string): ServerManagerClient {
  const url = new URL(baseUrl);
  if (!url.port) {
    url.port = DEFAULT_SERVER_MANAGER_PORT;
  }
  return new ServerManagerClient(url.origin);
}
