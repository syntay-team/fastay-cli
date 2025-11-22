import { createApp } from '@syntay/fastay';
import 'dotenv/config';

const port = 5000;

void (async () => {
  await createApp({
    apiDir: './src/api',
    baseRoute: '/api',
    port: port,
  });
})();
