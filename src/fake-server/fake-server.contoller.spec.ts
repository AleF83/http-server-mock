import { TestingModule, Test } from '@nestjs/testing';
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
    const response = controller.test();
    expect(response).toBeDefined();
  });
});
