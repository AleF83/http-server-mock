import { RequestMatcher } from './request-matching';

export enum FakeServerStatus {
  Created = 'created',
  Initialized = 'initialized',
  Starting = 'starting',
  Running = 'running',
  Stopping = 'stopping',
  Stopped = 'stopped',
}

export interface FakeServerInfo {
  id: string;
  name: string;
  port: number;
  status: FakeServerStatus;
}

export interface CreateFakeServerRequest {
  name: string;
  port: number;
  startOnInit?: boolean;
}

export interface CreateFakeServerResponse {
  id: string;
  status: FakeServerStatus;
}

export interface ResponseExpectation<T = any> {
  headers?: { [key: string]: string };
  body?: T;
}

export interface ResponseBehavior {
  delay: number;
}

export interface RegisterResponseMockRequest {
  requestMatcher?: RequestMatcher;
  expectedResponse?: ResponseExpectation;
  behavior?: ResponseBehavior;
}

export interface RegisterResponseMockResponse {
  id: string;
}
