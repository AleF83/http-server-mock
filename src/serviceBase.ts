import fastify from 'fastify';
import { v4 as uuidV4 } from 'uuid';

export interface ServiceConfig {
  name: string;
  port: number;
  server?: fastify.FastifyInstance;
}

export abstract class ServiceBase {
  private _id: string;

  private _config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this._id = uuidV4();
    this._config = config;

    if (!this._config.server) {
      this._config.server = fastify();
    }

    this.server.get('/health', (_req, res) => {
      res.send('Healthy');
    });
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._config.name;
  }

  get port(): number {
    return this._config.port;
  }

  get listening(): boolean {
    return this._config.server?.server.listening || false;
  }

  protected get server(): fastify.FastifyInstance {
    if (!this._config.server) {
      // TODO: Exception type
      throw new Error("The server wasn't initialized");
    }
    return this._config.server;
  }

  async start(): Promise<string> {
    const result = await this.server.listen({
      port: this._config.port,
    });
    return result;
  }

  async stop(): Promise<void> {
    await this.server.close();
  }

  update(_config: ServiceConfig): void {
    // TODO: Implement
    throw new Error('Not Implemented');
  }
}
