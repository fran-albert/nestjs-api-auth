export const environmentConfiguration = () => ({
  nodeEnv: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
  },
  database: {
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
  },
  auth: {
    secretKey: process.env.AUTH_SECRET_KEY,
  },
});
