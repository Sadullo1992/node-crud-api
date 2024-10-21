import { v4 as uuidv4 } from 'uuid';
import { users } from '../db/db';
import { sendToWorkerDB } from '../db/sendToWorkerDB';
import { User, UserData } from '../types';

class UserService {
  private _users: User[];
  constructor(users: User[]) {
    this._users = users;
  }

  getAllUsers(): User[] {
    if (process.env.MULTI) {
      sendToWorkerDB(this._users);
    }
    return this._users;
  }

  findUser(id: string): User | undefined {
    const user = this._users.find((item) => item.id === id);

    if (process.env.MULTI) {
      sendToWorkerDB(this._users);
    }

    return user;
  }

  create(userData: Omit<User, 'id'>): User | undefined {
    const user = { id: uuidv4(), ...userData } as User;
    this._users = [...this._users, user];

    if (process.env.MULTI) {
      sendToWorkerDB(this._users);
    }

    return this._users.at(-1);
  }

  update(id: string, userData: UserData): User | undefined {
    const user = this.findUser(id);
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    const updateUsers = this._users.map((item) =>
      item.id === id ? updatedUser : item,
    );
    this._users = [...updateUsers];

    if (process.env.MULTI) {
      sendToWorkerDB(this._users);
    }

    return updatedUser;
  }

  delete(id: string) {
    const filteredUsers = this._users.filter((item) => item.id !== id);
    this._users = [...filteredUsers];

    if (process.env.MULTI) {
      sendToWorkerDB(this._users);
    }
  }
}

export const userService = new UserService(users);
