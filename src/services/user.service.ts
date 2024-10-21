import { v4 as uuidv4 } from 'uuid';
import { User, UserData } from '../types';

export class UserService {
  private _users: User[];
  constructor() {
    this._users = [];
  }

  getAllUsers(): User[] {
    return this._users;
  }

  findUser(id: string): User | undefined {
    const user = this._users.find((item) => item.id === id);
    return user;
  }

  create(userData: UserData): User | undefined {
    const user = { id: uuidv4(), ...userData } as User;
    this._users = [...this._users, user];
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

    return updatedUser;
  }

  delete(id: string): boolean {
    const user = this.findUser(id);
    if (!user) return false;

    const filteredUsers = this._users.filter((item) => item.id !== id);
    this._users = [...filteredUsers];
    return true;
  }
}
