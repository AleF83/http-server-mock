import { Injectable } from '@nestjs/common';

@Injectable()
export class MockManagementService {
  private _mocks: Record<string, unknown>;

  constructor() {
    this._mocks = {};
  }

  getMocks(): unknown[] {
    return Object.values(this._mocks);
  }
}
