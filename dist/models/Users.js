"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.userTable = void 0;
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const pg_core_1 = require("drizzle-orm/pg-core");
serverless_1.neonConfig.fetchConnectionCache = true;
const sql = (0, serverless_1.neon)('postgres://faranbutt:bFQ0sXL7yEpj@ep-morning-smoke-895844.us-east-2.aws.neon.tech/web3');
exports.userTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull()
});
exports.db = (0, neon_http_1.drizzle)(sql);
