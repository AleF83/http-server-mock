import fastify from 'fastify';

const startServer = (): fastify.FastifyInstance => {
  const server = fastify();

  server.get('/', (_, res) => {
    res.status(200).send('OK');
  });

  return server;
};

export default startServer;
