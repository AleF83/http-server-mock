import fastify from 'fastify';

const server = fastify();

server.get('/', (_, res) => {
  res.status(200);
});

export default server;
