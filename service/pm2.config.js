module.exports = {
    apps: [
      {
        name: 'chatgpt-app',
        port: '3003',
        instances: 1,
        exec_mode: 'cluster',
        script: './build/index.mjs'
      }
    ]
  }
  