import 'dotenv/config';
import {z} from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10)
})
const env = envSchema.parse(process.env);

export default env;