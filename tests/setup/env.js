import "dotenv/config";

process.env.NODE_ENV = "test";
process.env.LOGIN_RATE_LIMIT_WINDOW_MS = "60000";
process.env.LOGIN_RATE_LIMIT_MAX = "1000";
process.env.DATABASE_URL = "file:./test.db";