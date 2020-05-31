import R from 'ramda';
import { ServiceMock, ServiceMockInfo } from './serviceMock';
import { ServiceConfig } from './serviceBase';

export class ServiceMockManager {
  private _serviceMocks: Record<string, ServiceMock>;

  constructor() {
    this._serviceMocks = {};
  }

  getServiceMocks(): ServiceMockInfo[] {
    return Object.values(this._serviceMocks).map((sm) => sm.info);
  }

  createServiceMock(config: ServiceConfig): string {
    // TODO: Check duplication
    const serviceMock = new ServiceMock(config);
    this._serviceMocks[serviceMock.id] = serviceMock;
    return serviceMock.id;
  }

  updateServiceMock(serviceMockId: string, config: ServiceConfig): void {
    const serviceMock = this._serviceMocks[serviceMockId];
    // TODO: check that exists
    serviceMock.update(config);
  }

  async deleteServiceMock(serviceMockId: string): Promise<void> {
    await this._serviceMocks[serviceMockId].stop();
    this._serviceMocks = R.dissoc(serviceMockId, this._serviceMocks);
  }
}
