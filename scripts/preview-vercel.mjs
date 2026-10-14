import { createServer } from 'node:http';
import handler from '../.vercel/output/functions/render.func/index.mjs';
const port = Number(process.env.PORT || 4303);
createServer(handler).listen(port, '127.0.0.1', () =>
  console.log('Packaged SSR preview: http://127.0.0.1:' + port),
);
