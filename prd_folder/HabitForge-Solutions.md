# HabitForge API — Solutions (Cevap Anahtari)

> Bu dosyaya SADECE su durumlarda bak:
> 1. Arama terimini Google'ladin, 2-3 kaynak okudun, hala yapamiyorsun
> 2. Baktiktan sonra: KAPAT, 5dk bekle, HAFIZADAN tekrar yaz
> 3. "Bakip gecmek" ogrenme DEGILDIR

---

## Gorev 1.1 — Project Setup + Dependencies

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```
**Neden boyle:** `strict: true` tip hatalarini derleme zamaninda yakalar. `outDir/rootDir` ayrimi build ciktisini kaynaktan izole eder.
**Pattern:** Configuration-as-Code

### package.json scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts"
  }
}
```

### .gitignore
```
node_modules
dist
.env
*.log
```

---

## Gorev 1.2 — Environment Validation

### src/config/env.ts
```typescript
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
});

const env = envSchema.parse(process.env);

export default env;
```
**Neden boyle:** `import 'dotenv/config'` en ust satirda — `.env` dosyasi parse'dan ONCE yuklenmeli. `z.coerce.number()` string'i number'a cevirir (env variable'lar her zaman string gelir).
**Pattern:** Fail-Fast Validation
**Kacis notu:** `z.number()` KULLANMA — PORT string olarak gelir, dogrudan reddeder.

### .env
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habitforge
JWT_SECRET=super-secret-dev-key-change-in-production-min-32-chars
```

### .env.example
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/habitforge
JWT_SECRET=your-secret-here-min-32-characters
```

---

## Gorev 1.3 — AppError + API Response

### src/utils/app-error.ts
```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Access denied') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(resource: string) {
    return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
  }

  static conflict(message: string) {
    return new AppError(message, 409, 'CONFLICT');
  }
}
```
**Neden boyle:** Static factory method'lar `new AppError('...', 404, 'NOT_FOUND')` yerine `AppError.notFound('Habit')` yazmayi saglar. Okunabilirlik + hata yapma sansi duser.
**Pattern:** Static Factory Method
**Kacis notu:** `Error.captureStackTrace` unutma — yoksa stack trace error handler'da dogru yeri gostermez.

### src/utils/api-response.ts
```typescript
import { Response } from 'express';

export const apiResponse = {
  success(res: Response, data: unknown, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  },

  error(res: Response, message: string, code: string, statusCode: number) {
    return res.status(statusCode).json({
      success: false,
      error: { message, code },
    });
  },
};
```
**Neden boyle:** Tum endpoint'ler ayni formatta response dondurur. Frontend develper `response.success` kontrolu ile her zaman calisabilir.
**Pattern:** Consistent Response Envelope

---

## Gorev 1.4 — Docker Compose + Database

### docker-compose.yml
```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: habitforge
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
**Neden boyle:** `alpine` imaj daha kucuk (~80MB vs ~400MB). Volume ile container silinse bile veri korunur.
**Pattern:** Infrastructure-as-Code

### src/config/database.ts
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import env from './env';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
```
**Neden boyle:** `postgres` (postgres-js) driver'i Drizzle ORM ile en iyi performansi verir. Tek bir db instance export ediyoruz — tum uygulama ayni connection pool'u kullanir.
**Pattern:** Singleton Connection

### drizzle.config.ts
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## Gorev 1.5 — Express App + Server + Error Handler

### src/app.ts
```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler';
import authRoutes from './modules/auth/auth.routes';
import habitsRoutes from './modules/habits/habits.routes';
import quotesRoutes from './modules/quotes/quotes.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/quotes', quotesRoutes);

app.use(errorHandler);

export default app;
```
**Neden boyle:** app.ts SADECE middleware ve route tanimlar, server.ts SADECE listen yapar. Test yazarken app'i import edip supertest ile kullanirsin.
**Pattern:** Separation of Concerns (App vs Server)

### src/server.ts
```typescript
import app from './app';
import env from './config/env';

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
```

### src/middlewares/error-handler.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
  });
}
```
**Neden boyle:** 4 parametre SART — Express error middleware'i boyle tanimlar. `AppError` instance'i ise bildigimiz hata (operational), degilse bilinmeyen hata (500).
**Pattern:** Global Error Handler
**Kacis notu:** 3 parametre yazarsan Express bunu NORMAL middleware olarak yorumlar, hatalar YAKALANMAZ.

---

## Gorev 2.1 — Users Schema + Migration

### src/db/schema/users.ts
```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
**Neden boyle:** `varchar('password_hash')` seklinde DB sutun adini acikca belirtiyoruz — Drizzle camelCase property'yi snake_case sutuna map'ler.
**Pattern:** Schema-First Development

### src/db/index.ts
```typescript
export * from './schema/users';
export * from './schema/habits';
export * from './schema/daily-logs';
export * from './schema/quotes';
```

---

## Gorev 2.2 — Password + JWT Utilities

### src/utils/password.ts
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```
**Neden boyle:** Salt rounds 12 = guvenlik ve performans dengesi. Her hash'te farkli salt uretilir, ayni sifre farkli hash verir.
**Pattern:** Utility Functions (Pure)

### src/utils/jwt.ts
```typescript
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { AppError } from './app-error';

interface TokenPayload {
  userId: number;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }
}
```
**Neden boyle:** `expiresIn: '7d'` — token 7 gun gecerli. verify basarisiz olursa (suresi dolmus, gecersiz secret) AppError firlatir — global error handler yakalar.
**Pattern:** Token-Based Authentication
**Kacis notu:** `jwt.verify` hata firlatir — try/catch SART. Yoksa unhandled error olur.

---

## Gorev 2.3 — Auth Repository + Service

### src/modules/auth/auth.repository.ts
```typescript
import { db } from '../../config/database';
import { users } from '../../db';
import { eq } from 'drizzle-orm';

export async function findByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}
```
**Neden boyle:** Repository SADECE DB islemleri yapar. Is mantigi (duplicate kontrol, sifre hashleme) burada YOKTUR.
**Pattern:** Repository Pattern

### src/modules/auth/auth.service.ts
```typescript
import * as authRepo from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../utils/app-error';

function sanitizeUser(user: { id: number; email: string; name: string; createdAt: Date }) {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

export async function register(data: { email: string; password: string; name: string }) {
  const existing = await authRepo.findByEmail(data.email);
  if (existing) {
    throw AppError.conflict('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await authRepo.createUser({
    email: data.email,
    passwordHash,
    name: data.name,
  });

  const token = generateToken({ userId: user.id });
  return { user: sanitizeUser(user), token };
}

export async function login(data: { email: string; password: string }) {
  const user = await authRepo.findByEmail(data.email);
  if (!user) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const isValid = await comparePassword(data.password, user.passwordHash);
  if (!isValid) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const token = generateToken({ userId: user.id });
  return { user: sanitizeUser(user), token };
}
```
**Neden boyle:** Service is mantigini toplar. Login'de "Email not found" ve "Wrong password" AYRI mesajlar verilmez — guvenlik icin her iki durumda da "Invalid credentials" donulur. `sanitizeUser` passwordHash'i response'dan cikarir.
**Pattern:** Service Layer + DTO Sanitization
**Kacis notu:** Response'da passwordHash GONDERME — buyuk guvenlik acigi.

---

## Gorev 2.4 — Auth Validation + Controller + Routes

### src/middlewares/validate.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/app-error';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw AppError.badRequest(message);
      }
      next(err);
    }
  };
}
```
**Neden boyle:** Generic middleware — herhangi bir Zod schema ile calisir. Hata mesajlarini birlestirip okunabilir format yapar.
**Pattern:** Middleware Factory (Higher-Order Function)

### src/modules/auth/auth.validation.ts
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
```

### src/modules/auth/auth.controller.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { apiResponse } from '../../utils/api-response';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    apiResponse.success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    apiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
}
```
**Neden boyle:** Controller SADECE HTTP katmani — request'ten veri alir, service'i cagirir, response dondurur. Is mantigi YOKTUR.
**Pattern:** Thin Controller

### src/modules/auth/auth.routes.ts
```typescript
import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { registerSchema, loginSchema } from './auth.validation';
import { register, login } from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
```

---

## Gorev 2.5 — Auth Middleware

### src/middlewares/authenticate.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/app-error';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized();
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  req.user = { userId: payload.userId };
  next();
}
```
**Neden boyle:** Bearer token formatini kontrol et, token'i cikar, verify et, req.user'a ekle. Basarisiz her durumda 401 donuyor.
**Pattern:** Authentication Middleware

### src/types/express.d.ts
```typescript
declare namespace Express {
  interface Request {
    user?: {
      userId: number;
    };
  }
}
```
**Neden boyle:** TypeScript'te `req.user` default olarak YOKTUR. Declaration merge ile Express Request tipini genisletiyoruz.
**Kacis notu:** Bu dosya `tsconfig.json`'daki `include` path'inde olmali (src/**/* zaten kapsiyor).

---

## Gorev 3.1 — Habits + DailyLogs + Quotes Schema

### src/db/schema/habits.ts
```typescript
import { pgTable, serial, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  cue: varchar('cue', { length: 255 }).notNull(),
  routine: varchar('routine', { length: 255 }).notNull(),
  reward: varchar('reward', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
**Pattern:** Domain Modeling (Tiny Habits Recipe)

### src/db/schema/daily-logs.ts
```typescript
import { pgTable, serial, integer, date, boolean, timestamp, unique } from 'drizzle-orm/pg-core';
import { habits } from './habits';
import { users } from './users';

export const dailyLogs = pgTable(
  'daily_logs',
  {
    id: serial('id').primaryKey(),
    habitId: integer('habit_id')
      .references(() => habits.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    date: date('date').notNull(),
    completed: boolean('completed').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueHabitDate: unique().on(table.habitId, table.date),
  })
);
```
**Neden boyle:** `unique().on(table.habitId, table.date)` — ayni aliskanlik ayni gunde iki kez loglanamaz. Veritabani seviyesinde veri butunlugu.
**Pattern:** Composite Unique Constraint

### src/db/schema/quotes.ts
```typescript
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  source: varchar('source', { length: 150 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## Gorev 3.2 — Habits CRUD

### src/modules/habits/habits.validation.ts
```typescript
import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1).max(100),
  cue: z.string().min(1).max(255),
  routine: z.string().min(1).max(255),
  reward: z.string().min(1).max(255),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  cue: z.string().min(1).max(255).optional(),
  routine: z.string().min(1).max(255).optional(),
  reward: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
```

### src/modules/habits/habits.repository.ts
```typescript
import { db } from '../../config/database';
import { habits, dailyLogs } from '../../db';
import { eq, and, desc } from 'drizzle-orm';

export async function findAllByUserId(userId: number) {
  return db.select().from(habits).where(eq(habits.userId, userId));
}

export async function findById(id: number) {
  const result = await db.select().from(habits).where(eq(habits.id, id));
  return result[0] || null;
}

export async function create(data: {
  userId: number;
  name: string;
  cue: string;
  routine: string;
  reward: string;
}) {
  const result = await db.insert(habits).values(data).returning();
  return result[0];
}

export async function update(id: number, data: Partial<{
  name: string;
  cue: string;
  routine: string;
  reward: string;
  isActive: boolean;
}>) {
  const result = await db
    .update(habits)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(habits.id, id))
    .returning();
  return result[0];
}

export async function remove(id: number) {
  await db.delete(habits).where(eq(habits.id, id));
}

export async function findDailyLog(habitId: number, date: string) {
  const result = await db
    .select()
    .from(dailyLogs)
    .where(and(eq(dailyLogs.habitId, habitId), eq(dailyLogs.date, date)));
  return result[0] || null;
}

export async function createDailyLog(data: {
  habitId: number;
  userId: number;
  date: string;
}) {
  const result = await db.insert(dailyLogs).values(data).returning();
  return result[0];
}

export async function deleteDailyLog(id: number) {
  await db.delete(dailyLogs).where(eq(dailyLogs.id, id));
}

export async function findLogsByHabitId(habitId: number) {
  return db
    .select()
    .from(dailyLogs)
    .where(eq(dailyLogs.habitId, habitId))
    .orderBy(desc(dailyLogs.date));
}

export async function countCompletedLogs(habitId: number) {
  const result = await db
    .select()
    .from(dailyLogs)
    .where(eq(dailyLogs.habitId, habitId));
  return result.length;
}
```
**Neden boyle:** Repository tum DB islemlerini merkezlestirir. Daily log islemleri de burada cunku ayni tablo grubuyla calisiyorlar.
**Pattern:** Repository Pattern

### src/modules/habits/habits.service.ts
```typescript
import * as habitsRepo from './habits.repository';
import { AppError } from '../../utils/app-error';

async function verifyOwnership(userId: number, habitId: number) {
  const habit = await habitsRepo.findById(habitId);
  if (!habit) throw AppError.notFound('Habit');
  if (habit.userId !== userId) throw AppError.forbidden();
  return habit;
}

export async function getAll(userId: number) {
  return habitsRepo.findAllByUserId(userId);
}

export async function getById(userId: number, habitId: number) {
  return verifyOwnership(userId, habitId);
}

export async function create(userId: number, data: {
  name: string;
  cue: string;
  routine: string;
  reward: string;
}) {
  return habitsRepo.create({ ...data, userId });
}

export async function update(userId: number, habitId: number, data: Partial<{
  name: string;
  cue: string;
  routine: string;
  reward: string;
  isActive: boolean;
}>) {
  await verifyOwnership(userId, habitId);
  return habitsRepo.update(habitId, data);
}

export async function remove(userId: number, habitId: number) {
  await verifyOwnership(userId, habitId);
  return habitsRepo.remove(habitId);
}

export async function toggleToday(userId: number, habitId: number) {
  await verifyOwnership(userId, habitId);

  const today = new Date().toISOString().split('T')[0];
  const existingLog = await habitsRepo.findDailyLog(habitId, today);

  if (existingLog) {
    await habitsRepo.deleteDailyLog(existingLog.id);
    return { completed: false, date: today };
  }

  await habitsRepo.createDailyLog({ habitId, userId, date: today });
  return { completed: true, date: today };
}

export async function getStats(userId: number, habitId: number) {
  const habit = await verifyOwnership(userId, habitId);

  const logs = await habitsRepo.findLogsByHabitId(habitId);
  const totalCompleted = logs.length;

  const currentStreak = calculateStreak(logs.map((l) => l.date));

  const createdAt = new Date(habit.createdAt);
  const today = new Date();
  const totalDays = Math.max(1, Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  const completionRate = Math.round((totalCompleted / totalDays) * 100);

  return { currentStreak, totalCompleted, completionRate, totalDays };
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateSet = new Set(dates);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streak = 0;
  let checkDate: Date;

  if (dateSet.has(todayStr)) {
    streak = 1;
    checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (dateSet.has(yesterdayStr)) {
    streak = 1;
    checkDate = new Date(yesterday);
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    return 0;
  }

  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
```
**Neden boyle:** `verifyOwnership` helper fonksiyonu tekrari onler. Streak algoritmasi: bugun VEYA dunden baslayarak geriye sayar — bugun henuz loglanmamissa streak kirilmis SAYILMAZ. `Set` kullanarak O(1) tarih kontrolu yapiyoruz.
**Pattern:** Service Layer + Helper Extraction + Set-Based Lookup

### src/modules/habits/habits.controller.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import * as habitsService from './habits.service';
import { apiResponse } from '../../utils/api-response';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const habits = await habitsService.getAll(req.user!.userId);
    apiResponse.success(res, habits);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitsService.getById(req.user!.userId, Number(req.params.id));
    apiResponse.success(res, habit);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitsService.create(req.user!.userId, req.body);
    apiResponse.success(res, habit, 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitsService.update(req.user!.userId, Number(req.params.id), req.body);
    apiResponse.success(res, habit);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await habitsService.remove(req.user!.userId, Number(req.params.id));
    apiResponse.success(res, { message: 'Habit deleted' });
  } catch (err) {
    next(err);
  }
}

export async function toggleToday(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await habitsService.toggleToday(req.user!.userId, Number(req.params.id));
    apiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await habitsService.getStats(req.user!.userId, Number(req.params.id));
    apiResponse.success(res, stats);
  } catch (err) {
    next(err);
  }
}
```
**Pattern:** Thin Controller

### src/modules/habits/habits.routes.ts
```typescript
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { createHabitSchema, updateHabitSchema } from './habits.validation';
import * as habitsController from './habits.controller';

const router = Router();

router.get('/', authenticate, habitsController.getAll);
router.post('/', authenticate, validate(createHabitSchema), habitsController.create);
router.get('/:id', authenticate, habitsController.getById);
router.patch('/:id', authenticate, validate(updateHabitSchema), habitsController.update);
router.delete('/:id', authenticate, habitsController.remove);
router.post('/:id/toggle', authenticate, habitsController.toggleToday);
router.get('/:id/stats', authenticate, habitsController.getStats);

export default router;
```

---

## Gorev 3.5 — Quotes Seed + Daily Endpoint

### src/db/seed.ts
```typescript
import { db } from '../config/database';
import { quotes } from './schema/quotes';

const quotesData = [
  { content: 'People change best by feeling good, not by feeling bad.', author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: "There's a tiny version of every habit you want.", author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: 'Simplicity changes behavior.', author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: 'Celebrate immediately to wire in the habit.', author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: 'After I [anchor], I will [tiny behavior].', author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: 'Motivation is unreliable. Design is what matters.', author: 'BJ Fogg', source: 'Tiny Habits' },
  { content: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear', source: 'Atomic Habits' },
  { content: 'Every action is a vote for the type of person you wish to become.', author: 'James Clear', source: 'Atomic Habits' },
  { content: 'Habits are the compound interest of self-improvement.', author: 'James Clear', source: 'Atomic Habits' },
  { content: 'Make it obvious. Make it attractive. Make it easy. Make it satisfying.', author: 'James Clear', source: 'Atomic Habits' },
  { content: 'The secret to lasting change is to focus on identity, not outcomes.', author: 'James Clear', source: 'Atomic Habits' },
  { content: 'What is rewarded is repeated. What is punished is avoided.', author: 'James Clear', source: 'Atomic Habits' },
  { content: "Don't break the chain.", author: 'Jerry Seinfeld', source: 'Popularized by Atomic Habits' },
  { content: 'Implementation intentions increase goal achievement by 2-3x.', author: 'Peter Gollwitzer', source: 'Gollwitzer & Sheeran (2006)' },
  { content: 'Small consistent actions beat large inconsistent ones.', author: 'BJ Fogg', source: 'Tiny Habits' },
];

async function seed() {
  console.log('Seeding quotes...');
  await db.delete(quotes);
  await db.insert(quotes).values(quotesData);
  console.log(`Seeded ${quotesData.length} quotes.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```
**Neden boyle:** Seed basinda `db.delete(quotes)` ile temizlik — birden fazla calistirma guvenli. `process.exit(0)` ile script tamamlaninca kapanir (yoksa DB connection acik kalir).
**Pattern:** Idempotent Seed Script

### src/modules/quotes/quotes.repository.ts
```typescript
import { db } from '../../config/database';
import { quotes } from '../../db';

export async function findAll() {
  return db.select().from(quotes);
}

export async function countAll() {
  const result = await db.select().from(quotes);
  return result.length;
}
```

### src/modules/quotes/quotes.service.ts
```typescript
import * as quotesRepo from './quotes.repository';

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function getTodayQuote() {
  const allQuotes = await quotesRepo.findAll();
  if (allQuotes.length === 0) return null;

  const dayOfYear = getDayOfYear(new Date());
  const index = dayOfYear % allQuotes.length;

  return allQuotes[index];
}
```
**Neden boyle:** `dayOfYear % totalQuotes` ile her gun ayni quote, herkes icin ayni. Deterministic — cache icin ideal. Yeni quote eklenince rotasyon otomatik guncellenir.
**Pattern:** Deterministic Daily Rotation

### src/modules/quotes/quotes.controller.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import * as quotesService from './quotes.service';
import { apiResponse } from '../../utils/api-response';
import { AppError } from '../../utils/app-error';

export async function getTodayQuote(_req: Request, res: Response, next: NextFunction) {
  try {
    const quote = await quotesService.getTodayQuote();
    if (!quote) throw AppError.notFound('Quote');
    apiResponse.success(res, quote);
  } catch (err) {
    next(err);
  }
}
```

### src/modules/quotes/quotes.routes.ts
```typescript
import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { getTodayQuote } from './quotes.controller';

const router = Router();

router.get('/today', authenticate, getTodayQuote);

export default router;
```
