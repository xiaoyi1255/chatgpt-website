module.exports = {
    apps: [
      {
        name: 'ws',
        port: '3000',
        instances: 1,
        exec_mode: 'cluster',
        script: './service/src/index.js'
      }
    ]
  }
  