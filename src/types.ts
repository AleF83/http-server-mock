import { v4 as uuidV4 } from 'uuid';

export interface ServiceMockOptions {
  name: string;
  port: number;
}

export interface ServiceMockInfo {
  id: string;
  name: string;
  port: number;
}

export class ServiceMock {
  private _id: string;
  private _name: string;
  private _port: number;

  constructor(options: ServiceMockOptions) {
    this._id = uuidV4();
    this._name = options.name;
    this._port = options.port;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get port(): number {
    return this._port;
  }

  get info(): ServiceMockInfo {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
    };
  }
}
