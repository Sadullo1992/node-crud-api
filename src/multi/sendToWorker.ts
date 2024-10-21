import { IncomingMessage, request, RequestOptions, ServerResponse } from 'http';
import { availableParallelism } from 'os';
import { StatusCodes } from '../types';
import { sendMessage } from '../utils/messages';

let currentWorkerIndex = 1;
export const sendToWorker = (req: IncomingMessage, res: ServerResponse) => {
  const numCPUs = availableParallelism();
  if (currentWorkerIndex === numCPUs) currentWorkerIndex = 1;

  const port = 4000 + currentWorkerIndex;

  console.log(
    `Forwarding request to server ${currentWorkerIndex} on port ${port}`,
  );

  const options: RequestOptions = {
    hostname: 'localhost',
    port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const requestServer = request(options, (response) => {
    res.writeHead(response.statusCode || 500, response.headers);
    response.pipe(res);
  });

  requestServer.on('error', () => {
    sendMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      message: 'internal server err',
    });
  });

  if (req.method === 'POST' || req.method === 'PUT') {
    req.pipe(requestServer);
  } else {
    requestServer.end();
  }

  currentWorkerIndex++;
};
