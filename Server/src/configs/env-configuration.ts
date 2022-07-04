export const envConfiguration = () => ({
  PORT: process.env.PORT,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_ADMINISTRATOR_EMAIL: process.env.DB_ADMINISTRATOR_EMAIL,
  MAIL_TRANSPORT: process.env.MAIL_TRANSPORT,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
});
