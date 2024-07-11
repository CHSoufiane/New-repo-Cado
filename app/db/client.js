import 'dotenv/config';

import { Client } from 'pg';

const client = new Client(process.env.DATABASE_URL);

client.connect();

module.exports = client;