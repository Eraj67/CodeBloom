process.env.NODE_ENV ??= "test";
process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/codebloom_test?schema=public";
process.env.JWT_SECRET ??= "test-secret-that-is-long-enough-for-jwt-signing";
process.env.FRONTEND_URL ??= "http://localhost:5500";
process.env.PORT ??= "4000";
process.env.CONTACT_EMAIL_TO ??= "test@codebloom.dev";
process.env.RESEND_API_KEY ??= "";