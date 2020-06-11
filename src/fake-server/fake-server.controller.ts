import http from 'http';
import { Controller, All, Req } from '@nestjs/common';
import getRawBody from 'raw-body';
import { RequestInfo } from '../types';

@Controller()
export class FakeServerController {
  @All()
  async test(@Req() request: http.IncomingMessage): Promise<RequestInfo> {
    const { url, method, headers } = request;
    const rawBody = await getRawBody(request, { encoding: 'utf8' });
    const body = JSON.parse(rawBody);
    return { url, method, headers, body };
  }
}
