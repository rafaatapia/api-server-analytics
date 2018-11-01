module.exports = {
  apps : [{
    name      : 'bmake-api',
    script    : './dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    watch: true,
    merge_logs: true,
    env: {
      SERVER_PORT: 5000,
      NODE_ENV: 'development'
    },
    env_production : {
      SERVER_PORT: 5001,
      NODE_ENV: 'production'
    }
  }]
};
