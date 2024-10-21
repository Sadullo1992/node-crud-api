import { IncomingMessage } from 'http';

export const getIdFromUrl = (url?: string) => url?.split('/')[3];

export const parseBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('error', (err) => reject(err));
    req.on('end', () => resolve(JSON.parse(body)));
  });
};

export const validateBody = (
  username: string,
  age: number,
  hobbies: string[],
) => {
  if (!username || !(typeof username === 'string')) return false;

  if (!age || !(typeof age === 'number')) return false;

  if (!hobbies || !Array.isArray(hobbies)) return false;

  if (hobbies.some((item) => !(typeof item === 'string'))) return false;

  return true;
};
