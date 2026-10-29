module.exports = {
  apps: [
    {
      name: 'drivemesh-server',
      cwd: '/var/www/drivemesh/packages/server',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5080,
        DATABASE_URL: process.env.DATABASE_URL,
        LISTEN_HOST: '127.0.0.1',
      },
    },
    {
      name: 'drivemesh-client',
      cwd: '/var/www/drivemesh/packages/client',
      script: '.output/server/index.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3080,
        NITRO_PORT: 3080,
      },
    },
  ],
};
