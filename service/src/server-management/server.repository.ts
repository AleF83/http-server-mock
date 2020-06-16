import { Injectable } from '@nestjs/common';
import { Dictionary } from 'typescript-collections';
import { CreateFakeServerRequest } from 'http-server-mock-common';
import * as Constants from '../constants';
import { ServerMock } from '../fake-server/fake-server.service';

@Injectable()
export class ServerRepository {
  private _mocks: Dictionary<string, ServerMock>;
  private _mocksByPort: Dictionary<number, ServerMock>;

  constructor() {
    this._mocks = new Dictionary<string, ServerMock>();
    this._mocksByPort = new Dictionary<number, ServerMock>();
  }

  getServers(): ServerMock[] {
    return this._mocks.values();
  }

  getServer(id: string): ServerMock | undefined {
    return this._mocks.getValue(id);
  }

  async createServer(options: CreateFakeServerRequest): Promise<string> {
    if (this._mocksByPort.containsKey(options.port)) {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    }
    const mock = new ServerMock(options);
    await mock.init();
    this._mocks.setValue(mock.id, mock);
    this._mocksByPort.setValue(mock.port, mock);
    return mock.id;
  }

  deleteServer(id: string): ServerMock | undefined {
    const mock = this._mocks.getValue(id);
    if (!mock) {
      return;
    }
    this._mocksByPort.remove(mock.port);
    return this._mocks.remove(id);
  }

  // TODO: Move to designated service
  async startServer(id: string): Promise<void> {
    const mock = this._mocks.getValue(id);
    await mock?.start();
  }

  async stopServer(id: string): Promise<void> {
    const mock = this._mocks.getValue(id);
    await mock?.stop();
  }
}
