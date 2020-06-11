import axios, { AxiosInstance } from 'axios';
import { CreateFakeServerRequest, CreateFakeServerResponse, FakeServerInfo } from 'http-server-mock-common';
import { FakeServerClient } from './fake-server';

export class ServerManagerClient {
  private readonly _axios: AxiosInstance;

  constructor(baseURL: string) {
    this._axios = axios.create({ baseURL });
  }

  async createFakeServer(request: CreateFakeServerRequest): Promise<FakeServerClient> {
    const response = await this._axios.post<CreateFakeServerResponse>('/servers', request);
    const fakeServerId = response.data.id;
    return new FakeServerClient(fakeServerId, this._axios);
  }

  async deleteFakeServer(id: string): Promise<void> {
    await this._axios.delete<void>(`/servers/${id}`);
  }

  async listFakeServers(): Promise<FakeServerInfo[]> {
    const response = await this._axios.get<FakeServerInfo[]>('/servers');
    return response.data;
  }

  async getFakeServerClient(id: string): Promise<FakeServerClient> {
    const response = await this._axios.get<FakeServerInfo>(`/servers/${id}`);
    return new FakeServerClient(response.data.id, this._axios);
  }
}
