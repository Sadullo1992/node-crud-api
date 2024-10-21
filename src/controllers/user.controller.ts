import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import {
  MSG_GET_USER_400,
  MSG_GET_USER_404,
  MSG_POST_USER_400,
} from '../constants';
import { UserService } from '../services/user.service';
import { StatusCodes, User } from '../types';
import { sendMessage } from '../utils/messages';
import { getIdFromUrl, parseBody, validateBody } from '../utils/utils';

const userService = new UserService();

export const getUsers = (res: ServerResponse) => {
  const users = userService.getAllUsers();

  return sendMessage(res, StatusCodes.OK, users);
};

export const getUser = (req: IncomingMessage, res: ServerResponse) => {
  const id = getIdFromUrl(req.url);

  if (!id || !uuidValidate(id))
    return sendMessage(res, StatusCodes.BAD_REQUEST, {
      message: MSG_GET_USER_400,
    });

  const user = userService.findUser(id);

  if (!user)
    return sendMessage(res, StatusCodes.NOT_FOUND, {
      message: MSG_GET_USER_404,
    });

  return sendMessage(res, StatusCodes.OK, user);
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await parseBody(req);

  const { username, age, hobbies } = body as User;

  const isValidBody = validateBody(username, age, hobbies);

  if (!isValidBody)
    return sendMessage(res, StatusCodes.BAD_REQUEST, {
      message: MSG_POST_USER_400,
    });

  const newUser = userService.create({ username, age, hobbies });

  return sendMessage(res, StatusCodes.CREATED, newUser);
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getIdFromUrl(req.url);

  if (!id || !uuidValidate(id))
    return sendMessage(res, StatusCodes.BAD_REQUEST, {
      message: MSG_GET_USER_400,
    });

  const user = userService.findUser(id);

  if (!user)
    return sendMessage(res, StatusCodes.NOT_FOUND, {
      message: MSG_GET_USER_404,
    });

  const body = await parseBody(req);

  const { username, age, hobbies } = body as User;

  const isValidBody = validateBody(username, age, hobbies);

  if (!isValidBody)
    return sendMessage(res, StatusCodes.BAD_REQUEST, {
      message: MSG_POST_USER_400,
    });

  const updatedUser = userService.update(id, { username, age, hobbies });

  return sendMessage(res, StatusCodes.OK, updatedUser);
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
  const id = getIdFromUrl(req.url);

  if (!id || !uuidValidate(id))
    return sendMessage(res, StatusCodes.BAD_REQUEST, {
      message: MSG_GET_USER_400,
    });

  const user = userService.findUser(id);

  if (!user)
    return sendMessage(res, StatusCodes.NOT_FOUND, {
      message: MSG_GET_USER_404,
    });

  userService.delete(id);

  return sendMessage(res, StatusCodes.NO_CONTENT);
};
