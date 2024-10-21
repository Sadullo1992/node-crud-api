import { createServer } from 'http';
import { listener } from '../listener';

const CLUSTER_PORT = 4000;
export const startServer = (port?: number) => {
  const server = createServer((req, res) => {
    listener(req, res);
  });

  if (port !== CLUSTER_PORT) {
    server.listen(port, () => {
      console.log(`Worker server is running port: ${port}`);
    });
  } else {
    server.listen(CLUSTER_PORT, () => {
      console.log(`Multi Server is running port: ${CLUSTER_PORT}`);
    });
  }
};
