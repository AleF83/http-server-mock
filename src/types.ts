import http from 'http';

export type RequestInfo = Pick<http.IncomingMessage, 'url' | 'headers' | 'method'> & { body: any };
