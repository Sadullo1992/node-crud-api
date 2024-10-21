import { IncomingMessage, ServerResponse } from 'http';
import { MSG_GET_USER_400, MSG_GET_USER_404 } from '../constants';
import { UserService } from '../services/user.service';
import { StatusCodes } from '../types';
import { sendMessage } from '../utils/messages';
import { getIdFromUrl } from '../utils/utils';

const userService = new UserService();

export const getUsers = (res: ServerResponse) => {
  const users = userService.getAllUsers();

  return sendMessage(res, StatusCodes.OK, users);
};

export const getUser = (req: IncomingMessage, res: ServerResponse) => {
  const id = getIdFromUrl(req.url);
  if (!id) return sendMessage(res, StatusCodes.BAD_REQUEST, MSG_GET_USER_400);

  const user = userService.findUser(id);
  if (!user) return sendMessage(res, StatusCodes.NOT_FOUND, MSG_GET_USER_404);

  return sendMessage(res, StatusCodes.OK, user);
};
