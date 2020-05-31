import http from 'http';
import fastify from 'fastify';
import { ServiceBase, ServiceConfig } from './serviceBase';
import { ServiceMockManager } from './serviceMockManager';

type ServiceMockCreateRequest = fastify.FastifyRequest<
  http.IncomingMessage,
  fastify.DefaultQuery,
  fastify.DefaultParams,
  fastify.DefaultHeaders,
  ServiceConfig
>;

type ServiceMockUpdateRequest = fastify.FastifyRequest<
  http.IncomingMessage,
  fastify.DefaultQuery,
  { serviceMockId: string },
  fastify.DefaultHeaders,
  ServiceConfig
>;

type ServiceMockDeleteRequest = fastify.FastifyRequest<
  http.IncomingMessage,
  fastify.DefaultQuery,
  { serviceMockId: string },
  fastify.DefaultHeaders,
  fastify.DefaultHeaders
>;

export class AdminService extends ServiceBase {
  private _manager: ServiceMockManager;

  constructor(config: ServiceConfig) {
    super(config);

    this._manager = new ServiceMockManager();

    this.server.register(this._routes, {
      prefix: '/admin',
    });
  }

  private _routes = (app: fastify.FastifyInstance): Promise<void> => {
    app.get('/', this._getServiceMocks);
    app.put('/', this._createServiceMock);
    app.post('/:serviceMockId', this._updateServiceMock);
    app.delete('/:serviceMockId', this._deleteServiceMock);
    return Promise.resolve();
  };

  private _getServiceMocks = (
    _request: fastify.FastifyRequest,
    reply: fastify.FastifyReply<http.ServerResponse>
  ): void => {
    const serviceMocks = this._manager.getServiceMocks();
    reply.send(serviceMocks);
  };

  private _createServiceMock = (
    request: ServiceMockCreateRequest,
    reply: fastify.FastifyReply<http.ServerResponse>
  ): void => {
    const serviceMockId = this._manager.createServiceMock(request.body);
    reply.send({ Id: serviceMockId });
  };

  private _updateServiceMock = (
    request: ServiceMockUpdateRequest,
    reply: fastify.FastifyReply<http.ServerResponse>
  ): void => {
    this._manager.updateServiceMock(request.params.serviceMockId, request.body);
    reply.send();
  };

  private _deleteServiceMock = async (
    request: ServiceMockDeleteRequest,
    reply: fastify.FastifyReply<http.ServerResponse>
  ): Promise<void> => {
    await this._manager.deleteServiceMock(request.params.serviceMockId);
    reply.send();
  };
}
