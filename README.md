# http-server-mock

This project makes it easy to mock APIs that you service depends on. It enables more realistic testing and possibility to test variety of dependent API behavior cases.

## Server

### Run as docker image

```bash
docker run -p 8080:8080 -p 10000-20000:10000-20000 alef83/http-server-mock:latest
```

### Run in docker-compose

```yaml
services:
  http-server-mock:
    image: alef83/http-server-mock:latest
    ports:
      - 8080:8080
      - 10000-20000:10000-20000
```

## Client library

### Add to project

```bash
npm install --save --dev http-server-mock-common http-server-mock-client
```

### Usage

Create fake servers for dependent APIs before running tests:

```typescript
import { CreateFakeServerRequest, RegisterResponseMockRequest } from 'http-server-mock-common';
import { createServerManagementClient, ServerManagementClient, FakeServerClient } from 'http-server-mock-client';

...

const serverManagementClient = createServerManagementClient('http://localhost:8080');

const fakeServerClient = await serverManagementClient.createFakeServer({ name: 'API mock', port: 10000 });

const responseMock: RegisterResponseMockRequest = {...};
await fakeServer.registerResponseMock(responseMock);
```

Now the fake server will response to matching requests with defined responses.

## Roadmap

- [ ] CI/CD
- [ ] CLI package
- [ ] Support configuration
- [ ] Documentation
