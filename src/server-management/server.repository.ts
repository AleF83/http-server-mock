import { Injectable } from '@nestjs/common';
import { Dictionary } from 'typescript-collections';
import * as Constants from '../constants';
import { ServerMockOptions } from '../types';
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

  createServer(options: ServerMockOptions): string {
    if (this._mocksByPort.containsKey(options.port)) {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    }
    const mock = new ServerMock(options);
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
}
