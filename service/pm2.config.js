module.exports = {
  apps: [
    {
      name: 'chatgpt-app',
      port: '3002',
      instances: 1,
      exec_mode: 'cluster',
      script: './build/index.mjs',
      error_file: '../logs/err.log',
      out_file: '../logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        PORT: 3002,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 3002,
        NODE_ENV: 'production',
      },
    },
  ],
}
