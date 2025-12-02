module.exports = {
  apps: [{
    name: 'ginova-app',
    script: './dist/index.js',
    cwd: '/home/ginovalno/public_html',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    restart_delay: 4000,
    min_uptime: 10000,
    max_restarts: 10,
    exp_backoff_restart_delay: 100,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
