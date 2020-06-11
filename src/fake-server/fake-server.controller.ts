import http from 'http';
import { Controller, All, Req } from '@nestjs/common';
import { RequestInfo } from '../types';

@Controller()
export class FakeServerController {
  @All()
  test(@Req() request: http.IncomingMessage): RequestInfo {
    const { url, method, headers } = request;
    return { url, method, headers };
  }
}
