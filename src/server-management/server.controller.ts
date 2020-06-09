import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as Constants from '../constants';
import { ServerMockInfo, ServerMockOptions } from '../types';
import { ServerRepository } from './server.repository';

@Controller('/servers')
export class ServerController {
  constructor(private readonly _serverMockRepository: ServerRepository) {}

  @Get()
  getServers(): ServerMockInfo[] {
    return this._serverMockRepository.getServers().map((sm) => sm.info);
  }

  @Get('/:id')
  getServer(@Param('id') id: string): ServerMockInfo {
    const mock = this._serverMockRepository.getServer(id);
    if (!mock) {
      throw new NotFoundException(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
    }
    return mock.info;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createServer(@Body() options: ServerMockOptions): Promise<{ id: string }> {
    try {
      const id = await this._serverMockRepository.createServer(options);
      return { id };
    } catch (error) {
      if (error.message === Constants.ERR_MOCK_PORT_ALREADY_IN_USE) {
        throw new BadRequestException(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
      }
      throw error;
    }
  }

  @Delete('/:id')
  deleteServer(@Param('id') id: string): ServerMockInfo | undefined {
    return this._serverMockRepository.deleteServer(id)?.info;
  }

  // TODO: Move to designated controller
  @Post('/:id/start')
  @HttpCode(200)
  async startServer(@Param('id') id: string): Promise<void> {
    return this._serverMockRepository.startServer(id);
  }

  @Post('/:id/stop')
  @HttpCode(200)
  async stopServer(@Param('id') id: string): Promise<void> {
    return this._serverMockRepository.stopServer(id);
  }
}
