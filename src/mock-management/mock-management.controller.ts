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
import { ServiceMockInfo, ServiceMockOptions } from '../types';
import { MockManagementService } from './mock-management.service';

@Controller()
export class MockManagementController {
  constructor(private readonly _mockManager: MockManagementService) {}

  @Get()
  getMocks(): ServiceMockInfo[] {
    return this._mockManager.getMocks().map((sm) => sm.info);
  }

  @Get('/:id')
  getMock(@Param('id') id: string): ServiceMockInfo {
    const mock = this._mockManager.getMock(id);
    if (!mock) {
      throw new NotFoundException(Constants.ERR_MOCK_ID_DOES_NOT_EXIST);
    }
    return mock.info;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMock(@Body() options: ServiceMockOptions): { id: string } {
    try {
      const id = this._mockManager.createMock(options);
      return { id };
    } catch (error) {
      if (error.message === Constants.ERR_MOCK_PORT_ALREADY_IN_USE) {
        throw new BadRequestException(Constants.ERR_MOCK_PORT_ALREADY_IN_USE);
      }
      throw error;
    }
  }

  @Delete('/:id')
  deleteMock(@Param('id') id: string): ServiceMockInfo | undefined {
    return this._mockManager.deleteMock(id)?.info;
  }
}
