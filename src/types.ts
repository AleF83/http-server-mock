export enum ServerMockStatus {
  NotInitialized = 'not-initialized',
  Starting = 'starting',
  Running = 'running',
  Stopping = 'stopping',
  Stopped = 'stopped',
}

export interface ServerMockOptions {
  name: string;
  port: number;
  startOnInit?: boolean;
}

export interface ServerMockInfo {
  id: string;
  name: string;
  port: number;
  status: ServerMockStatus;
}

export interface ServerResponse {
  url: string;
}
