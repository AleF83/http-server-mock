import { ServiceBase, ServiceConfig } from './serviceBase';

export interface ServiceMockInfo {
  id: string;
  name: string;
  port: number;
  listening: boolean;
}

export class ServiceMock extends ServiceBase {
  constructor(config: ServiceConfig) {
    super(config);
  }

  get info(): ServiceMockInfo {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
      listening: this.listening,
    };
  }
}
