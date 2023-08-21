import { neon, neonConfig } from '@neondatabase/serverless';
import { InferModel } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable,serial,text,varchar } from 'drizzle-orm/pg-core';


neonConfig.fetchConnectionCache = true;
 
const sql = neon('postgres://faranbutt:bFQ0sXL7yEpj@ep-morning-smoke-895844.us-east-2.aws.neon.tech/web3');

export const userTable = pgTable('users',{
    id:serial('id').primaryKey(),
    name:text('name').notNull(),
    email:text('email').unique().notNull(),
    password:varchar('password',{length:255}).notNull()

})

export type User = InferModel<typeof userTable>;
export type AddUser = InferModel<typeof userTable,"insert">;


export const db = drizzle(sql);