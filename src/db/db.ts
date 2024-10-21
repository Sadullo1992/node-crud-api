import { User } from '../types';

export let users: User[] = [];

export function handleMessage(message: { workerData: User[] }) {
  if (message.workerData) {
    users = message.workerData;
  }
}
