module.exports = {
  apps: [
    {
      name: 'bedr_frontend_professional_dev',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      cwd: '/var/www/html/dev/bedr_frontend_professional_dev',
      interpreter: 'node',
    },
    {
      name: 'bedr_frontend_professional_stage',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      cwd: '/var/www/html/stage/bedr_frontend_professional_stage',
      interpreter: 'node',
    },
    {
      name: 'bedr_frontend_professional_test',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      cwd: '/var/www/html/test/bedr_frontend_professional_test',
      interpreter: 'node',
    },
  ],
};
