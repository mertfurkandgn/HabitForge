import { db } from '../../config/database';
import { users} from '../../db';
import { eq } from 'drizzle-orm';

export async function findByEmail(email: string) {

    const user = await db.select().from(users).where(eq(users.email,email));
    return user[0];


}

export async function createUser(data:{email:string,passwordHash: string,name:string}) {
    const user = await db.insert(users).values(data).returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt
    });
    return user[0];
}