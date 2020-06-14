import { AxiosInstance } from 'axios';
import { CreateFakeServerRequest, CreateFakeServerResponse, FakeServerInfo } from 'http-server-mock-common';
import { FakeServerClient } from './fake-server';

export class ServerManagementClient {
  constructor(private readonly _axios: AxiosInstance) {}

  async createFakeServer(request: CreateFakeServerRequest): Promise<FakeServerClient> {
    const response = await this._axios.post<CreateFakeServerResponse>('', request);
    const fakeServerId = response.data.id;
    return new FakeServerClient(fakeServerId, this._axios);
  }

  async deleteFakeServer(id: string): Promise<void> {
    await this._axios.delete<void>(`/${id}`);
  }

  async listFakeServers(): Promise<FakeServerInfo[]> {
    const response = await this._axios.get<FakeServerInfo[]>('');
    return response.data;
  }

  async getFakeServerClient(id: string): Promise<FakeServerClient> {
    const response = await this._axios.get<FakeServerInfo>(`/${id}`);
    return new FakeServerClient(response.data.id, this._axios);
  }
}
