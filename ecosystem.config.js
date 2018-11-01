module.exports = {
  apps : [{
    name      : 'bmake-api',
    script    : './dist/main.js',
    instances: 0,
    exec_mode: 'cluster',
    merge_logs: true,
    env: {
      SERVER_PORT: 3000,
      NODE_ENV: 'development'
    }
  }]
};
