import { AxiosInstance } from 'axios';
import { RegisterResponseMockRequest, RegisterResponseMockResponse, FakeServerInfo } from 'http-server-mock-common';

export class FakeServerClient {
  constructor(private readonly _id: string, private readonly _axios: AxiosInstance) {}

  get id(): string {
    return this._id;
  }

  async start(): Promise<void> {
    const response = await this._axios.post<void>(`/servers/${this._id}/start`);
    return response.data;
  }

  async stop(): Promise<void> {
    const response = await this._axios.post<void>(`/servers/${this._id}/stop`);
    return response.data;
  }

  async getInfo(): Promise<FakeServerInfo> {
    const response = await this._axios.get<FakeServerInfo>(`/servers/${this._id}`);
    return response.data;
  }

  async registerResponseMock(responseMock: RegisterResponseMockRequest): Promise<RegisterResponseMockResponse> {
    const response = await this._axios.post<RegisterResponseMockResponse>(
      `/servers/${this._id}/register-response-mock`,
      responseMock
    );
    return response.data;
  }
}
