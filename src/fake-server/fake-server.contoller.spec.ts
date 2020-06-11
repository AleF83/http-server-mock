import { TestingModule, Test } from '@nestjs/testing';
import { Request as MockRequest } from 'mock-http';
import { FakeServerController } from './fake-server.controller';

describe('Fake server controller', () => {
  let controller: FakeServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FakeServerController],
      providers: [],
    }).compile();

    controller = app.get(FakeServerController);
  });

  test('Default endpoint', () => {
    const url = '/hello';
    const request = new MockRequest({
      url,
    });

    const response = controller.test(request);
    expect(response.url).toEqual(url);
  });
});
