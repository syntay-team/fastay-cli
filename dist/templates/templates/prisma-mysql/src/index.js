import { createApp } from '@syntay/fastay';

const port = 5000;

void (async () => {
  await createApp({
    apiDir: './src/api',
    baseRoute: '/api',
    port: port,
    
  });
})();
