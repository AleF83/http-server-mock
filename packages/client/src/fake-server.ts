import { AxiosInstance } from 'axios';
import {
  RegisterResponseMockRequest,
  RegisterResponseMockResponse,
  FakeServerInfo,
  FakeServerCall,
} from 'http-server-mock-common';

export class FakeServerClient {
  constructor(private readonly _id: string, private readonly _axios: AxiosInstance) {}

  get id(): string {
    return this._id;
  }

  async start(): Promise<void> {
    const response = await this._axios.post<void>(`/${this._id}/start`);
    return response.data;
  }

  async stop(): Promise<void> {
    const response = await this._axios.post<void>(`/${this._id}/stop`);
    return response.data;
  }

  async getInfo(): Promise<FakeServerInfo> {
    const response = await this._axios.get<FakeServerInfo>(`/${this._id}`);
    return response.data;
  }

  async registerResponseMock(responseMock: RegisterResponseMockRequest): Promise<RegisterResponseMockResponse> {
    const response = await this._axios.post<RegisterResponseMockResponse>(
      `/${this._id}/register-response-mock`,
      responseMock
    );
    return response.data;
  }

  async unregisterResponseMock(responseMockId: string): Promise<void> {
    const response = await this._axios.delete<void>(`/${this._id}/register-response-mock/${responseMockId}`);
    return response.data;
  }

  async unregisterAllResponseMocks(): Promise<void> {
    const response = await this._axios.delete<void>(`/${this._id}/register-response-mock`);
    return response.data;
  }

  async getCalls(responseMockId: string): Promise<FakeServerCall[]> {
    const response = await this._axios.get<FakeServerCall[]>(
      `/${this._id}/register-response-mock/${responseMockId}/calls`
    );
    return response.data;
  }

  async getAllCalls(): Promise<FakeServerCall[]> {
    const response = await this._axios.get<FakeServerCall[]>(`/${this._id}/calls`);
    return response.data;
  }
}
