import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { v4 as uuidV4 } from 'uuid';
import { ServerResponse, ServerMockOptions, ServerMockInfo, ServerMockStatus } from '../types';
import { FakeServerModule } from './fake-server.module';

export class ServerMock {
  private _id: string;
  private _name: string;
  private _port: number;
  private _status: ServerMockStatus;
  private _responses: ServerResponse[];
  private readonly _startOnInit: boolean | undefined = true;

  private _serverApp: INestApplication | undefined;

  constructor(options: ServerMockOptions) {
    this._id = uuidV4();
    this._name = options.name;
    this._port = options.port;
    this._status = ServerMockStatus.Created;
    this._startOnInit = options.startOnInit ?? true;
    this._responses = [];
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

  get status(): ServerMockStatus {
    return this._status;
  }

  get info(): ServerMockInfo {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
      status: this.status,
    };
  }

  get responses(): ServerResponse[] {
    return this._responses;
  }

  async init(): Promise<void> {
    if (this.status !== ServerMockStatus.Created) {
      return;
    }
    if (!this._serverApp) {
      const server = fastify({ logger: true });
      this._serverApp = await NestFactory.create<NestFastifyApplication>(FakeServerModule, new FastifyAdapter(server));
      this._status = ServerMockStatus.Initialized;
    }
    if (this._startOnInit) {
      await this.start();
    }
  }

  async start(): Promise<void> {
    this._status = ServerMockStatus.Starting;
    await this._serverApp?.listen(this.port, '0.0.0.0');
    this._status = ServerMockStatus.Running;
  }

  async stop(): Promise<void> {
    this._status = ServerMockStatus.Stopping;
    await this._serverApp?.close();
    this._status = ServerMockStatus.Stopped;
  }
}
