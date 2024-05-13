import pg from 'pg';

const { Client } = pg;

export const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'truemates',
    user: 'postgres',
    password: '@Jingtot1029',
});
