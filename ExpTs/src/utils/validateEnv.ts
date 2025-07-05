import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    LOGS_PATH: str(),
    DATABASE_URL: str()
  });
};

export default validateEnv;
