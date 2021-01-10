export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
        name: process.env.DATABASE_NAME || 'smartplan_db'
    },
    supla: {
        authUrl: process.env.SUPLA_AUTH_URL || 'https://svr36.supla.org/oauth/v2/auth',
        tokenUrl: process.env.SUPLA_TOKEN_URL || "https://svr36.supla.org/oauth/v2/token",
        clientId: process.env.SUPLA_CLIENT_ID || "YOUR_OAUTH_CLIENT_ID",
        clientSecret: process.env.SUPLA_CLIENT_SECRET || "YOUR_OAUTH_CLIENT_SECRET",
        callbackUrl: process.env.SUPLA_CALLBACK_URL || "http://localhost:4000/auth/supla/callback",
        apiVersion: process.env.SUPLA_API_VERSION || "/api/v2.3.0"
    },
    websiteUrl: process.env.WEBSITE_URL || "http://localhost:3000",
    serverUrl: process.env.SERVER_URL || "http://localhost:4000"
});
