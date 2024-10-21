import cluster from 'cluster';
import { availableParallelism } from 'os';

import 'dotenv/config';
import { startServer } from './server';

export const CLUSTER_PORT = 4000;

const useMulti = () => {
  const numCPUs = availableParallelism();
  if (process.env.MULTI) {
    if (cluster.isPrimary) {
      console.log(`Master ${process.pid} is running`);

      for (let i = 1; i < numCPUs; i++) {
        const workerPort = CLUSTER_PORT + i;
        cluster.fork({ PORT: workerPort });
      }

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork({ PORT: worker.id });
      });

      startServer(CLUSTER_PORT);
    } else {
      console.log(`Worker process started: ${process.pid}`);
      startServer(Number(process.env.PORT));
    }
  }
};

useMulti();
