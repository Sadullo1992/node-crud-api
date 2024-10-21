import { IncomingMessage, ServerResponse } from 'http';
import cluster from 'cluster';
import * as userController from './controllers/user.controller';
import { sendMessage } from './utils/messages';
import { MSG_API_ROUTE_404 } from './constants';
import { StatusCodes } from './types';
import { sendToWorker } from './multi/sendToWorker';

const PATTERN = /\/api\/users\/\w+/;

export const listener = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (process.env.MULTI && cluster.isPrimary) {
      sendToWorker(req, res);
    } else if (req.url === '/api/users' && req.method === 'GET') {
      userController.getUsers(res);
    } else if (req.url?.match(PATTERN) && req.method === 'GET') {
      userController.getUser(req, res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
      userController.createUser(req, res);
    } else if (req.url?.match(PATTERN) && req.method === 'PUT') {
      userController.updateUser(req, res);
    } else if (req.url?.match(PATTERN) && req.method === 'DELETE') {
      userController.deleteUser(req, res);
    } else
      sendMessage(res, StatusCodes.NOT_FOUND, { message: MSG_API_ROUTE_404 });
  } catch {
    sendMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      message: 'Internal server error!',
    });
  }
};
