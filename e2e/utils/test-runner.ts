import { join } from 'path';
import type { Config } from '@jest/types';
import DefaultJestRunner, {
  TestRunnerContext,
  Test,
  TestWatcher,
  OnTestStart,
  OnTestSuccess,
  OnTestFailure,
  TestRunnerOptions,
} from 'jest-runner';
import * as dockerCompose from 'docker-compose';
import waitOn from 'wait-on';

const serviceName = 'http-server-mock';
const cwd = join(__dirname, '../..');
const options: dockerCompose.IDockerComposeOptions = {
  cwd,
  log: true,
};

class E2ETestRunner extends DefaultJestRunner {
  constructor(config: Config.GlobalConfig, context: TestRunnerContext | undefined) {
    super(config, context);
  }

  async setup(): Promise<void> {
    await dockerCompose.buildOne(serviceName, options);

    await dockerCompose.upAll(options);
    await waitOn({
      resources: ['http-get://localhost:8080/servers'],
      timeout: 3000,
      verbose: true,
    });
  }

  async handleError(error: Error): Promise<void> {
    await dockerCompose.logs(serviceName, options);
    throw error;
  }

  async teardown(): Promise<void> {
    await dockerCompose.down(options);
    await waitOn({
      resources: ['http-get://localhost:8080/servers'],
      timeout: 10000,
      reverse: true,
      verbose: true,
    });
  }

  async runTests(
    tests: Test[],
    watcher: TestWatcher,
    onStart: OnTestStart,
    onResult: OnTestSuccess,
    onFailure: OnTestFailure,
    options: TestRunnerOptions
  ): Promise<void> {
    try {
      await this.setup();
      await super.runTests(tests, watcher, onStart, onResult, onFailure, options);
    } catch (error) {
      await this.handleError(error);
    } finally {
      await this.teardown();
    }
  }
}

export = E2ETestRunner;
