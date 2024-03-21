require('dotenv').config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/main',
  KEY_PATCH,
} = process.env;
module.exports = {
  apps: [
    {
      name: 'api-service',
      script: './src/app.ts',
    },
  ],
  deploy: {
    production: {
      key: KEY_PATCH,
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/Stas00001/mesto-project-plus.git',
      path: DEPLOY_PATH,
      'pre-deploy': `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && npm run start',
    },
  },
};
