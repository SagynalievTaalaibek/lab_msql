import path from 'node:path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  mysql: {
    host: 'localhost',
    user: 'root',
    database: 'resource',
    password: 'root',
  }
};

export default config;