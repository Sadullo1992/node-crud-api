import { createServer } from 'http';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const init = () => {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });

  server.listen(PORT, () => {
    console.log(`Server is running port: ${PORT}`);
  });
};

init();
