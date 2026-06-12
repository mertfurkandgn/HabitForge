import { pgTable ,serial ,varchar,timestamp} from "drizzle-orm/pg-core";

export const users = pgTable('users',{

    id:serial().primaryKey(),
    email:varchar({length:255}).notNull().unique(),
    name:varchar({length:100}).notNull(),
    passwordHash: varchar('password_hash', {length:255}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),

})