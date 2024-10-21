import process from 'node:process';
import { User } from '../types';

export const sendToWorkerDB = (users: User[]) => {
  process.send?.({ workerData: users });
};
