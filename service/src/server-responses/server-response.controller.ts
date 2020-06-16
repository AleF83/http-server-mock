import { Controller, Get, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { RegisterResponseMockRequest, RegisterResponseMockResponse } from 'http-server-mock-common';
import * as Constants from '../constants';
import { ServerRepository } from '../server-management/server.repository';

@Controller('/servers/:serverId/responses')
export class ServerResponseController {
  constructor(private readonly _serverMockRepository: ServerRepository) {}

  @Get()
  getServerResponses(@Param('serverId') serverId: string): RegisterResponseMockRequest[] {
    const fakeServer = this._serverMockRepository.getServer(serverId);
    if (!fakeServer) {
      throw new NotFoundException(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
    }

    return fakeServer.responses;
  }

  @Post()
  registerServerResponse(
    @Param('serverId') serverId: string,
    @Body() responseMock: RegisterResponseMockRequest
  ): RegisterResponseMockResponse {
    const fakeServer = this._serverMockRepository.getServer(serverId);
    if (!fakeServer) {
      throw new NotFoundException(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
    }

    return fakeServer.registerResponse(responseMock);
  }
}
