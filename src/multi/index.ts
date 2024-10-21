import cluster from 'cluster';
import { availableParallelism } from 'os';

import 'dotenv/config';
import { startServer } from './server';
import { handleMessage, users } from '../db/db';

export const CLUSTER_PORT = 4000;

const useMulti = () => {
  const numCPUs = availableParallelism();
  if (process.env.MULTI) {
    if (cluster.isPrimary) {
      console.log(`Master ${process.pid} is running`);

      for (let i = 1; i < numCPUs; i++) {
        const workerPort = CLUSTER_PORT + i;
        const worker = cluster.fork({ PORT: workerPort });
        worker.send({ workerData: users });
      }

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork({ PORT: worker.id });
      });

      startServer(CLUSTER_PORT);
    } else {
      console.log(`Worker process started: ${process.pid}`);
      process.on('message', handleMessage);

      startServer(Number(process.env.PORT));
    }
  }
};

useMulti();
