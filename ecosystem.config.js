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
        DATABASE_URL: 'postgresql://drivemesh:drivemesh_secure_pass@localhost:5434/drivemesh',
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
