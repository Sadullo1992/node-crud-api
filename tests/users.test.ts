import request from 'supertest';
import 'dotenv/config';
import { server } from '../src';
import { MSG_GET_USER_404, MSG_POST_USER_400 } from '../src/constants';

// GET /api/users test with 3 scenarios
describe('GET /api/users', () => {
  afterAll(() => {
    server.close();
  });
  it('should get response status code 200', async () => {
    return request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
  it('should return empty array', async () => {
    return request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(0);
      });
  });
  it('should return array', async () => {
    return request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });
});

// POST api/users test with 3 scenarios
describe('POST /api/users', () => {
  afterAll(() => {
    server.close();
  });
  it('should create a user', async () => {
    const mockUserData = {
      username: 'Alex',
      age: 23,
      hobbies: [],
    };
    return request(server)
      .post('/api/users')
      .send(mockUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.statusCode).toBe(201);
      });
  });
  it('should return status code 400 When invalid user data', async () => {
    return request(server)
      .post('/api/users')
      .send({ username: 'John' })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });
  it('should return message When invalid user data', async () => {
    return request(server)
      .post('/api/users')
      .send({ username: 'John' })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe(MSG_POST_USER_400);
      });
  });
});

// GET api/user/{userId} test with 3 scenarios
describe('GET api/user/{userId}', () => {
  let userId: string;
  afterAll(() => {
    server.close();
  });
  it('should create a user', async () => {
    const mockUserData = {
      username: 'Alex',
      age: 23,
      hobbies: [],
    };
    return request(server)
      .post('/api/users')
      .send(mockUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        userId = res.body.id ?? '';
        expect(res.statusCode).toBe(201);
      });
  });
  it('should return user by id', async () => {
    return request(server)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
  it('should return 400 code When provided invalid user id', async () => {
    return request(server)
      .get(`/api/users/f903-758f-fdf`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });
  it('should return 404 code When provided user id, but user does not exist', async () => {
    return request(server)
      .get(`/api/users/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });
});

// PUT api/users/{userId} test with 3 scenarios
describe('PUT api/users/{userId}', () => {
  let userId: string;
  afterAll(() => {
    server.close();
  });
  it('should create a user', async () => {
    const mockUserData = {
      username: 'Alex',
      age: 23,
      hobbies: [],
    };
    return request(server)
      .post('/api/users')
      .send(mockUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        userId = res.body.id ?? '';
        expect(res.statusCode).toBe(201);
      });
  });
  it('should return updated user by id and provided data', async () => {
    return request(server)
      .put(`/api/users/${userId}`)
      .send({ username: 'John', age: 24, hobbies: [] })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
  it('should return put method 400 code When provided invalid user id', async () => {
    return request(server)
      .put(`/api/users/f903-758f-fdf`)
      .send({ username: 'John', age: 24, hobbies: [] })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });
  it('should return put method 404 code When provided user id, but user does not exist', async () => {
    return request(server)
      .put(`/api/users/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`)
      .send({ username: 'John', age: 24, hobbies: [] })
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });
});

// DELETE api/users/{userId} test with 3 scenarios
describe('DELETE api/users/{userId}', () => {
  let userId: string;
  afterAll(() => {
    server.close();
  });
  it('should create a user', async () => {
    const mockUserData = {
      username: 'Alex',
      age: 23,
      hobbies: [],
    };
    return request(server)
      .post('/api/users')
      .send(mockUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        userId = res.body.id ?? '';
        expect(res.statusCode).toBe(201);
      });
  });
  it('should return status code delete user by id', async () => {
    return request(server)
      .delete(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(204)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });
  it('should return 400 code delete method When provided invalid user id', async () => {
    return request(server)
      .delete(`/api/users/f903-758f-fdf`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });
  it('should return delete method 404 code When provided user id, but user does not exist', async () => {
    return request(server)
      .delete(`/api/users/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });
});

// GET api/users/{userId} after deleting such as object test with 3 scenarios
describe('GET api/users/{userId} after deleting such as object', () => {
  let userId: string;
  afterAll(() => {
    server.close();
  });
  it('should create a user with mock data', async () => {
    const mockUserData = {
      username: 'Alex',
      age: 23,
      hobbies: [],
    };
    return request(server)
      .post('/api/users')
      .send(mockUserData)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        userId = res.body.id ?? '';
        expect(res.statusCode).toBe(201);
      });
  });
  it('should return status code delete user by id', async () => {
    return request(server)
      .delete(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(204)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });
  it('should return 400 code get method When after deleting object', async () => {
    return request(server)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });
  it('should return message get method When after deleting object', async () => {
    return request(server)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe(MSG_GET_USER_404);
      });
  });
});
