import { Injectable } from '@nestjs/common';
import { Dictionary } from 'typescript-collections';
import * as Constants from '../constants';
import { ServiceMock, ServiceMockOptions } from '../types';

@Injectable()
export class MockManagementService {
  private _mocks: Dictionary<string, ServiceMock>;
  private _mocksByPort: Dictionary<number, ServiceMock>;

  constructor() {
    this._mocks = new Dictionary<string, ServiceMock>();
    this._mocksByPort = new Dictionary<number, ServiceMock>();
  }

  getMocks(): ServiceMock[] {
    return this._mocks.values();
  }

  getMock(id: string): ServiceMock | undefined {
    return this._mocks.getValue(id);
  }

  createMock(options: ServiceMockOptions): string {
    if (this._mocksByPort.containsKey(options.port)) {
      throw new Error(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
    }
    const mock = new ServiceMock(options);
    this._mocks.setValue(mock.id, mock);
    this._mocksByPort.setValue(mock.port, mock);
    return mock.id;
  }

  deleteMock(id: string): ServiceMock | undefined {
    const mock = this._mocks.getValue(id);
    if (!mock) {
      return;
    }
    this._mocksByPort.remove(mock.port);
    return this._mocks.remove(id);
  }
}
