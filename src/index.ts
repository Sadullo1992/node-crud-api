import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { sendMessage } from './utils/messages';
import { MSG_API_ROUTE_404 } from './constants';
import { StatusCodes } from './types';

const PORT = process.env.PORT || 3000;
const PATTERN = /\/api\/users\/\w+/;

const listener = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url === '/api/users' && req.method === 'GET') {
      // getUsers(res);
    } else if (req.url?.match(PATTERN) && req.method === 'GET') {
      // getUser(req, res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
      // createUser(req, res);
    } else if (req.url?.match(PATTERN) && req.method === 'PUT') {
      // updateUser(req, res);
    } else if (req.url?.match(PATTERN) && req.method === 'DELETE') {
      // deleteUser(req, res);
    } else
      sendMessage(res, StatusCodes.NOT_FOUND, { message: MSG_API_ROUTE_404 });
  } catch {
    sendMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      message: 'Internal server error!',
    });
  }
};

const init = () => {
  const server = createServer(listener);

  server.listen(PORT, () => {
    console.log(`Server is running port: ${PORT}`);
  });
};

init();
