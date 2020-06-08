import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { v4 as uuidV4 } from 'uuid';
import { ServerResponse, ServerMockOptions, ServerMockInfo } from '../types';
import { FakeServerModule } from './fake-server.module';

export class ServerMock {
  private _id: string;
  private _name: string;
  private _port: number;
  private _responses: ServerResponse[];

  private _serverApp: INestApplication | undefined;

  constructor(options: ServerMockOptions) {
    this._id = uuidV4();
    this._name = options.name;
    this._port = options.port;
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

  get info(): ServerMockInfo {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
    };
  }

  get responses(): ServerResponse[] {
    return this._responses;
  }

  async start(): Promise<void> {
    if (!this._serverApp) {
      const server = fastify();
      this._serverApp = await NestFactory.create<NestFastifyApplication>(FakeServerModule, new FastifyAdapter(server));
    }
    await this._serverApp.listen(this.port, '0.0.0.0');
  }

  async stop(): Promise<void> {
    await this._serverApp?.close();
  }
}
