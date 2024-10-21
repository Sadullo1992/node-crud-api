import { createServer } from 'http';
import 'dotenv/config';
import { listener } from './listener';

const PORT = process.env.PORT || 3000;

export const server = createServer(listener);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running port: ${PORT}`);
  });
}
