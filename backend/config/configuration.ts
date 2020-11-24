export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
        name: process.env.DATABASE_NAME || 'supla_db'
    }
});
