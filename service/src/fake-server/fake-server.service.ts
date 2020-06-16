import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { v4 as uuidV4 } from 'uuid';
import {
  FakeServerInfo,
  FakeServerStatus,
  CreateFakeServerRequest,
  RegisterResponseMockRequest,
  RegisterResponseMockResponse,
} from 'http-server-mock-common';
import { Dictionary } from 'typescript-collections';
import { FakeServerModule } from './fake-server.module';

export class ServerMock {
  private _id: string;
  private _name: string;
  private _port: number;
  private _status: FakeServerStatus;
  private _responses: Dictionary<string, RegisterResponseMockRequest>;
  private readonly _startOnInit: boolean | undefined = true;

  private _serverApp: INestApplication | undefined;

  constructor(options: CreateFakeServerRequest) {
    this._id = uuidV4();
    this._name = options.name;
    this._port = options.port;
    this._status = FakeServerStatus.Created;
    this._startOnInit = options.startOnInit ?? true;
    this._responses = new Dictionary<string, RegisterResponseMockRequest>();
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

  get status(): FakeServerStatus {
    return this._status;
  }

  get info(): FakeServerInfo {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
      status: this.status,
    };
  }

  get responses(): RegisterResponseMockRequest[] {
    return this._responses.values();
  }

  async init(): Promise<void> {
    if (this.status !== FakeServerStatus.Created) {
      return;
    }
    if (!this._serverApp) {
      const server = fastify({ logger: true });
      this._serverApp = await NestFactory.create<NestFastifyApplication>(FakeServerModule, new FastifyAdapter(server));
      this._status = FakeServerStatus.Initialized;
    }
    if (this._startOnInit) {
      await this.start();
    }
  }

  async start(): Promise<void> {
    this._status = FakeServerStatus.Starting;
    await this._serverApp?.listen(this.port, '0.0.0.0');
    this._status = FakeServerStatus.Running;
  }

  async stop(): Promise<void> {
    this._status = FakeServerStatus.Stopping;
    await this._serverApp?.close();
    this._status = FakeServerStatus.Stopped;
  }

  registerResponse(responseMock: RegisterResponseMockRequest): RegisterResponseMockResponse {
    const id: string = uuidV4();
    this._responses.setValue(id, responseMock);
    return { id };
  }
}
