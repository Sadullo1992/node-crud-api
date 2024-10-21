import { ServerResponse } from 'http';

const sendMessage = (res: ServerResponse, code: number, data?: unknown) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export { sendMessage };
