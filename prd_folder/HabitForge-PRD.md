# HabitForge API — Evidence-Based Habit Tracker

## Node.js + Express + TypeScript + PostgreSQL + Drizzle ORM

**Toplam Sure:** 3 gun (gunluk 1-1.5 saat) = ~4 saat
**Seviye:** Junior (senior mindset olusturma)
**Bilimsel Temel:** Tiny Habits (BJ Fogg), Atomic Habits (James Clear), Implementation Intentions (Gollwitzer)

---

## Bu Sistem Neden Ise Yarar? (Bilimsel Temel)

### 1. Micro-Task Decomposition (Bilissel Yuk Teorisi — Sweller)
Working memory ayni anda 3-5 bagimsiz birim tutar (Cowan 2010). Her gorev 10-20dk'lik atomik adimlara bolunmus. Buyuk gorev = felc. Kucuk gorev = ilerleme hissi = devam etme.

### 2. Productive Struggle (Uretken Zorluk — Kapur 2016)
Sinha & Kapur (2021) meta-analizi: once problem cozme, sonra ogretim alan grup g = 0.36-0.87 daha iyi ogrendi. Takilmak ogrenmenin parcasi. Ama 20dk+ ilerleme yoksa arama terimine gec.

### 3. Retrieval Practice (Aktif Geri Cagirma — Roediger & Karpicke 2006)
Rowland (2014) meta-analizi: aktif geri cagirma restudy'ye karsi g = 0.50. Her gorev sonunda "Kendine Sor" sorulari var. KODU KAPATIP cevapla.

### 4. Spaced Review (Aralikli Tekrar — Cepeda 2006)
Cepeda et al. (2006) meta-analizi (317 deney): 1+ gun sonra tekrar = uzun sureli hafiza. Her phase basinda onceki phase'den sorular var.

### 5. Self-Explanation (Kendine Aciklama — Chi 1994, Bisra 2018)
Bisra et al. (2018) meta-analizi (69 effect size): kendine aciklama yapanlar g = 0.55 daha iyi ogrendi. "Bu satir ne yapiyor?" degil, "NEDEN boyle yapiyoruz?" formatinda sorular.

### 6. Error-Driven Learning (Hatadan Ogrenme — Metcalfe 2017)
Keith & Frese (2008) meta-analizi: hata yapip duzeltmek, hatasiz ogrenmeden daha etkili — AMA sadece corrective feedback varsa. Her gorev sonunda "Sik Yapilan Hatalar" bolumu var.

### 7. Implementation Intentions (Uygulama Niyeti — Gollwitzer & Sheeran 2006)
Sheeran et al. (2025) meta-analizi (642 test, d = 0.36): "Calisacagim" yerine "Saat 19:00'da masaya oturup Phase 1'den baslayacagim" demek takip olasiligini arttirir.

### 8. Progressive Scaffolding (Kademeli Destek Azaltma — Renkl)
Phase 1-2'de adimlar COK DETAYLI (import satirlari, parametre tipleri). Phase 3-4'te sadece NE yapilacagi soylenir, NASIL kullanicida.

---

## ALTIN KURALLAR

```
KURAL 1: Adimi oku → ONCE KENDIN DENE (minimum 10 dakika)
KURAL 2: Takilirsan → Verilen "Arama Terimi"ni Google'a yaz
KURAL 3: Hala takilirsan → Resmi docs'a bak (Express docs, Drizzle docs, Zod docs)
KURAL 4: 20dk+ gecti, hicbir ilerleme yok → Solutions dosyasina bak
KURAL 5: Cozdukten sonra → "Kendine Sor" sorularini KODU KAPATIP cevapla
KURAL 6: Ertesi gun → Onceki phase'in retrieval sorularini tekrar cevapla
KURAL 7: Her gorev sonunda git commit at
```

**Zorluk kalibrasyonu:**
- 10-15dk takilmak = NORMAL (productive struggle)
- 20dk+ ilerleme yok = arama terimine gec
- 5dk'dan kisa = cok kolay, daha derin dusun

**Solutions'a bakma kurali:**
- Arama terimini Google'ladin, 2-3 kaynak okudun, hala yapamiyorsun → BAK
- Baktiktan sonra: kapat, 5dk bekle, HAFIZADAN tekrar yaz
- "Bakip gecmek" ogrenme DEGILDIR

---

## Proje Aciklamasi

**HabitForge**, BJ Fogg'un Tiny Habits ve James Clear'in Atomic Habits metodolojilerine dayanan kanit-tabanli bir aliskanlik takip API'si.

**Neden farkli:**
- Her aliskanlik "After I [CUE], I will [ROUTINE], and celebrate by [REWARD]" formatinda (Tiny Habits Recipe)
- Streak mekanizmasi (Atomic Habits: "Don't break the chain")
- Gunluk motivasyon cumlesi (gercek kitap/arastirma kaynaklari)
- REST API tasarimi — ileride mobile app, web dashboard, hatta CLI client baglayabilirsin

**Muhendislik pratikleri (portfolyoda fark yaratan):**
- Layered Architecture: Repository → Service → Controller (katman bagimsizligi)
- Environment validation (uygulama baslarken patlar, runtime'da degil)
- Custom error handling (tutarli hata formati)
- Input validation (Zod ile her endpoint'te)
- Swagger/OpenAPI documentation
- Docker Compose (yerel gelistirme)
- Deploy (canli URL)

---

## Core Entities

### users
| Sutun | Tip | Kisitlama |
|-------|-----|-----------|
| id | SERIAL | PRIMARY KEY |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### habits
| Sutun | Tip | Kisitlama |
|-------|-----|-----------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| name | VARCHAR(100) | NOT NULL |
| cue | VARCHAR(255) | NOT NULL |
| routine | VARCHAR(255) | NOT NULL |
| reward | VARCHAR(255) | NOT NULL |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### daily_logs
| Sutun | Tip | Kisitlama |
|-------|-----|-----------|
| id | SERIAL | PRIMARY KEY |
| habit_id | INTEGER | NOT NULL, FK → habits(id) ON DELETE CASCADE |
| user_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| date | DATE | NOT NULL |
| completed | BOOLEAN | NOT NULL, DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| | | UNIQUE(habit_id, date) |

### quotes
| Sutun | Tip | Kisitlama |
|-------|-----|-----------|
| id | SERIAL | PRIMARY KEY |
| content | TEXT | NOT NULL |
| author | VARCHAR(100) | NOT NULL |
| source | VARCHAR(150) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

---

## API Endpoints

| Method | Path | Auth | Aciklama | Response |
|--------|------|------|----------|----------|
| POST | /api/auth/register | Public | Yeni kullanici olustur | { user, token } |
| POST | /api/auth/login | Public | Giris yap | { user, token } |
| GET | /api/habits | Auth | Tum aliskanliklari getir (bugunun durumuyla) | { habits[] } |
| POST | /api/habits | Auth | Yeni aliskanlik olustur | { habit } |
| GET | /api/habits/:id | Auth | Tek aliskanlik detayi | { habit } |
| PATCH | /api/habits/:id | Auth | Aliskanlik guncelle | { habit } |
| DELETE | /api/habits/:id | Auth | Aliskanlik sil | { message } |
| POST | /api/habits/:id/toggle | Auth | Bugunku tamamlanmayi toggle et | { dailyLog } |
| GET | /api/habits/:id/stats | Auth | Streak + istatistik | { streak, completionRate, totalCompleted } |
| GET | /api/quotes/today | Auth | Gunun motivasyon cumlesi | { quote } |

**Toplam: 10 endpoint**

### Response Formati (tum endpoint'lerde ayni)

Basarili:
```json
{
  "success": true,
  "data": { ... }
}
```

Hata:
```json
{
  "success": false,
  "error": {
    "message": "Habit not found",
    "code": "NOT_FOUND"
  }
}
```

---

## Folder Structure

```
habitforge-api/
├── src/
│   ├── config/
│   │   ├── env.ts              ← environment validation
│   │   └── database.ts         ← drizzle client
│   ├── db/
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── habits.ts
│   │   │   ├── daily-logs.ts
│   │   │   └── quotes.ts
│   │   ├── index.ts            ← export all schemas
│   │   └── seed.ts             ← quote seed data
│   ├── middlewares/
│   │   ├── error-handler.ts
│   │   ├── authenticate.ts
│   │   └── validate.ts
│   ├── utils/
│   │   ├── app-error.ts
│   │   ├── api-response.ts
│   │   ├── password.ts
│   │   └── jwt.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── habits/
│   │   │   ├── habits.repository.ts
│   │   │   ├── habits.service.ts
│   │   │   ├── habits.controller.ts
│   │   │   ├── habits.routes.ts
│   │   │   └── habits.validation.ts
│   │   └── quotes/
│   │       ├── quotes.repository.ts
│   │       ├── quotes.service.ts
│   │       ├── quotes.controller.ts
│   │       └── quotes.routes.ts
│   ├── app.ts                  ← Express app (middleware + routes)
│   └── server.ts               ← HTTP server (listen)
├── docker-compose.yml
├── drizzle.config.ts
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

**Neden app.ts ve server.ts ayri:** Test yazarken app'i import edip supertest ile kullanirsin, server'i ayaga kaldirmana gerek kalmaz. Bu production projelerinde standart.

**Neden modules/ yapisi:** Her modül kendi icinde bagimsiz. Yeni feature = yeni folder. Redis eklemek istersen service katmanina dokunursun, controller'a degil.

---

## Zaman Plani

| Phase | Gun | Konu | Gorev Sayisi | Tahmini Sure |
|-------|-----|------|-------------|-------------|
| 1 | Gun 1 | Foundation | 5 | ~70 dk |
| 2 | Gun 2 | Auth | 5 | ~70 dk |
| 3 | Gun 3 (1. yari) | Habits + Tracking | 5 | ~75 dk |
| 4 | Gun 3 (2. yari) | Ship It | 4 | ~45 dk |
| **TOPLAM** | **3 gun** | | **19 gorev** | **~4.5 saat** |

---

# Phase 1: Foundation (Gun 1 — ~70 dk)

> Scaffolding seviyesi: **YUKSEK** — Her adim detayli, import satirlari verilir.

---

### Gorev 1.1 — Project Setup + Dependencies

**Hedef:** Proje klasorunu olustur, tum dependency'leri yukle, TypeScript yapilandir.
**Gercek Dunya:** Profesyonel projelerde dependency'ler ilk gunden belirlenir. Yanlis versiyon veya eksik paket sonra saatlerce debug'a neden olur.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: Proje klasorunu olustur ve npm init calistir
- `mkdir habitforge-api && cd habitforge-api`
- `npm init -y`
- Arama Terimi: "npm init create new node project"
- Kontrol: `package.json` dosyasi olusmus

#### Adim 2: Production dependency'leri yukle
- `npm install express cors dotenv zod drizzle-orm postgres bcryptjs jsonwebtoken`
- Arama Terimi: "npm install multiple packages at once"
- Kontrol: `node_modules` klasoru olusmus, `package.json` icinde dependencies gorunuyor

#### Adim 3: Dev dependency'leri yukle
- `npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken tsx drizzle-kit`
- Kontrol: `package.json` icinde devDependencies gorunuyor

#### Adim 4: tsconfig.json olustur
- Proje kokune `tsconfig.json` olustur
- `strict: true`, `outDir: "dist"`, `rootDir: "src"`, `esModuleInterop: true`, `module: "commonjs"`, `target: "ES2020"`, `resolveJsonModule: true`, `skipLibCheck: true`
- Arama Terimi: "tsconfig.json strict mode express typescript"
- Kontrol: `npx tsc --noEmit` hatasiz calisir (henuz kaynak dosya yok, hata vermemeli)

#### Adim 5: Folder structure'i olustur
- `src/config/`, `src/db/schema/`, `src/middlewares/`, `src/utils/`, `src/modules/auth/`, `src/modules/habits/`, `src/modules/quotes/` klasorlerini olustur
- Kontrol: `ls src/` komutu tum alt klasorleri gosteriyor

#### Adim 6: .gitignore olustur
- `node_modules`, `dist`, `.env`, `*.log` satirlarini ekle
- Arama Terimi: "node gitignore template"
- Kontrol: dosya olusmus

#### Adim 7: package.json'a script'leri ekle
- `"dev": "tsx watch src/server.ts"`, `"build": "tsc"`, `"start": "node dist/server.js"`, `"db:generate": "drizzle-kit generate"`, `"db:migrate": "drizzle-kit migrate"`, `"db:seed": "tsx src/db/seed.ts"`
- Kontrol: `npm run dev` calistir, hata versin ama tsx'in calistigini gor

#### Adim 8: git init + ilk commit
- `git init && git add . && git commit -m "chore: project init with dependencies"`
- Kontrol: `git log --oneline` ilk commit'i gosteriyor

**Sik Yapilan Hatalar:**
- @types paketlerini unutmak: TypeScript "Cannot find module" hatasi verir. Her Express-ekosistemi paketi icin @types gerekir.
- `rootDir` ve `outDir` ayarlanmamasi: Build ciktisi karmasik olur, import path'leri bozulur.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. `outDir` ve `rootDir` neden ayrilir? Build dosyalari kaynak kodla karissa ne olur?
2. `tsx` ile `ts-node` arasindaki temel fark nedir? Neden tsx tercih ettik?
3. `skipLibCheck: true` ne yapar? Neden production projelerinde yaygin kullanilir?

---

### Gorev 1.2 — Environment Validation

**Hedef:** `.env` dosyasindaki degerleri Zod ile uygulama baslarken dogrula.
**Gercek Dunya:** Production'da bir env degiskeni eksikse, uygulama calisir ama bir endpoint cagirildiginda patlar. Baskenti dogrularsan uygulama HEMEN baslarken patlar — hatalar dakikalar icinde fark edilir.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: .env dosyasi olustur
- Proje kokune `.env` dosyasi olustur
- Icerigi: `PORT=3000`, `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habitforge`, `JWT_SECRET=super-secret-dev-key-change-in-production`
- Kontrol: dosya olusmus, 3 degisken var

#### Adim 2: .env.example dosyasi olustur
- `.env` ile ayni key'ler ama degerleri bos veya placeholder
- `PORT=3000`, `DATABASE_URL=postgresql://user:password@localhost:5432/habitforge`, `JWT_SECRET=your-secret-here`
- Kontrol: dosya olusmus

#### Adim 3: src/config/env.ts dosyasi olustur
- `import 'dotenv/config';` (ilk satir — .env'yi yukler)
- `import { z } from 'zod';`
- Arama Terimi: "zod environment variables validation typescript"
- Kontrol: dosya olusmus, iki import var

#### Adim 4: envSchema tanimla
- `z.object()` icinde: `PORT` icin `z.coerce.number().default(3000)`, `DATABASE_URL` icin `z.string().url()`, `JWT_SECRET` icin `z.string().min(10)`
- Arama Terimi: "zod coerce number string to number"
- Kontrol: schema degiskeni tanimli

#### Adim 5: process.env'yi parse et ve export et
- `const env = envSchema.parse(process.env);`
- `export default env;`
- Kontrol: `import env from './config/env'` her yerde kullanilabilir

#### Adim 6: Test et — hatali deger ver
- `.env` icinde `PORT=abc` yap, `npm run dev` calistir
- Zod hata mesajini gor
- Duzelt, `PORT=3000` yap
- Kontrol: hatali degerde uygulama baslamadi, dogruda basladi

```bash
git add .
git commit -m "feat: add environment validation with zod"
```

**Sik Yapilan Hatalar:**
- `import 'dotenv/config'` UNUTMAK: `process.env` tamamen bos gelir, tum validation basarisiz olur. Bu import env.ts'in EN UST satirinda olmali.
- `z.number()` kullanmak `z.coerce.number()` yerine: PORT bir string olarak gelir (.env'den), `z.number()` string'i reddeder. `z.coerce.number()` once donusturur sonra dogrular.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Environment validation neden uygulama baslarken yapilir, endpoint icinde degil?
2. `z.coerce.number()` ile `z.number()` arasindaki fark nedir? PORT icin hangisi neden gerekli?
3. `.env` dosyasini neden `.gitignore`'a ekliyoruz ama `.env.example`'i eklemiyoruz?

---

### Gorev 1.3 — Custom Error Class + API Response Helper

**Hedef:** Tutarli hata sinifi ve API response formati olustur.
**Gercek Dunya:** Buyuk projelerde her endpoint farkli formatta hata dondururse frontend gelistirici delirir. Tutarli format = butun ekibin hayati kolaylasir. Custom error class'i bir kere yazarsin, tum projede kullanirsin.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: src/utils/app-error.ts dosyasi olustur
- `export class AppError extends Error { ... }`
- Constructor: `message: string`, `statusCode: number`, `code: string`
- `isOperational: boolean = true` (programci hatasi vs beklenen hata ayrimi)
- Arama Terimi: "custom error class typescript express isOperational"
- Kontrol: dosya olusmus, class tanimli

#### Adim 2: Static factory method'lari ekle
- `static badRequest(message: string)` — 400, "BAD_REQUEST"
- `static unauthorized(message = 'Authentication required')` — 401, "UNAUTHORIZED"
- `static forbidden(message = 'Access denied')` — 403, "FORBIDDEN"
- `static notFound(resource: string)` — 404, "NOT_FOUND", message: `${resource} not found`
- `static conflict(message: string)` — 409, "CONFLICT"
- Arama Terimi: "typescript static factory method pattern"
- Kontrol: `AppError.notFound('Habit')` cagirinca statusCode 404 ve message "Habit not found" donuyor

#### Adim 3: src/utils/api-response.ts dosyasi olustur
- `success(res, data, statusCode = 200)` — `{ success: true, data }`
- `error(res, message, code, statusCode)` — `{ success: false, error: { message, code } }`
- Express `Response` tipini import et
- Kontrol: dosya olusmus, iki fonksiyon export ediliyor

```bash
git add .
git commit -m "feat: add custom AppError class and API response helpers"
```

**Sik Yapilan Hatalar:**
- `extends Error` yaparken `super(message)` cagrmayi unutmak: Error mesaji bos kalir, debug imkansizlasir.
- `Error.captureStackTrace(this, this.constructor)` eklemeyi unutmak: Stack trace'de AppError constructor'i gozukur, asil hata yeri degil.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Static factory method pattern neden dogrudan `new AppError(...)` yerine tercih edilir?
2. `isOperational` field'i ne ise yarar? Production'da bu ayrimi nasil kullanirsin?
3. API response'u neden `res.json({ success, data })` yerine bir helper fonksiyonla yapiyoruz?

---

### Gorev 1.4 — Docker Compose + Database Connection

**Hedef:** PostgreSQL'i Docker ile ayaga kaldir, Drizzle ORM ile baglantiyi kur.
**Gercek Dunya:** Her gelistiricinin makinesine PostgreSQL kurmak yerine Docker Compose ile tek komutla ayni ortami olusturursun. "Bende calisiyor ama sende calismiyor" problemini ortadan kaldirir.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: docker-compose.yml olustur
- Proje kokune `docker-compose.yml` olustur
- `postgres` servisi: image `postgres:16-alpine`, port `5432:5432`
- Environment: `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=habitforge`
- Volume: `postgres_data:/var/lib/postgresql/data`
- Arama Terimi: "docker compose postgresql 16 setup"
- Kontrol: dosya olusmus

#### Adim 2: Docker Compose'u calistir
- `docker compose up -d`
- Kontrol: `docker compose ps` ciktisinda postgres servisi "running" durumunda

#### Adim 3: src/config/database.ts olustur
- `import { drizzle } from 'drizzle-orm/postgres-js';`
- `import postgres from 'postgres';`
- `import env from './env';`
- `const client = postgres(env.DATABASE_URL);`
- `export const db = drizzle(client);`
- Arama Terimi: "drizzle orm postgres-js setup typescript"
- Kontrol: dosya olusmus, db export ediliyor

#### Adim 4: drizzle.config.ts olustur
- Proje kokune `drizzle.config.ts`
- `schema: './src/db/schema/*'`, `out: './drizzle'`, `dialect: 'postgresql'`, `dbCredentials: { url: process.env.DATABASE_URL }`
- Arama Terimi: "drizzle kit config typescript"
- Kontrol: dosya olusmus

```bash
git add .
git commit -m "feat: add docker compose for postgresql and drizzle config"
```

**Sik Yapilan Hatalar:**
- Docker Desktop calismadiginda `docker compose up` hata verir: Once Docker Desktop'in acik oldugundan emin ol.
- `DATABASE_URL`'deki port numarasinin docker-compose'daki ile eslesmemesi: Her ikisi de 5432 olmali.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Docker volume neden gerekli? Volume olmadan container'i durdursan ne olur?
2. `postgres:16-alpine` ile `postgres:16` arasindaki fark nedir?
3. Drizzle ORM'de `postgres-js` driver'i ne is yapar? Drizzle direkt PostgreSQL'e baglanabilir mi?

---

### Gorev 1.5 — Express App + Server + Error Handler

**Hedef:** Express uygulamasini ve HTTP server'i AYRI dosyalarda olustur, global error handler middleware'i ekle.
**Gercek Dunya:** app.ts ve server.ts ayrilmasi test icin kritik. Test yazarken server'i ayaga kaldirmadan app'i import edip supertest ile kullanirsin. Bu pattern buyuk projelerde standarttir.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: src/app.ts olustur
- `import express from 'express';`
- `import cors from 'cors';`
- `const app = express();`
- `app.use(cors());`
- `app.use(express.json());`
- Kontrol: dosya olusmus, app tanimli

#### Adim 2: Health check endpoint ekle
- `app.get('/api/health', (req, res) => { ... })` — `{ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } }` dondur
- `export default app;`
- Kontrol: app export ediliyor

#### Adim 3: src/middlewares/error-handler.ts olustur
- Express error middleware: 4 parametre `(err, req, res, next)` — bu 4 parametre SART, yoksa Express error handler olarak tanimaz
- `AppError` instance'i mi kontrol et: evet ise `err.statusCode` ve `err.code` kullan
- Degilse 500 + "INTERNAL_ERROR" dondur
- Arama Terimi: "express error handling middleware 4 parameters typescript"
- Kontrol: dosya olusmus, 4 parametreli fonksiyon var

#### Adim 4: Error handler'i app.ts'e ekle
- `import { errorHandler } from './middlewares/error-handler';`
- `app.use(errorHandler);` — ROUTE'LARDAN SONRA eklenmeli (sirasi onemli)
- Kontrol: app.ts'de errorHandler import ve use var

#### Adim 5: src/server.ts olustur
- `import app from './app';`
- `import env from './config/env';`
- `app.listen(env.PORT, () => console.log(...));`
- Kontrol: `npm run dev` calistir, "Server running on port 3000" yazisi gorun

#### Adim 6: Health check'i test et
- Browser veya Postman'den `GET http://localhost:3000/api/health`
- `{ success: true, data: { status: "ok", ... } }` donmeli
- Kontrol: 200 status, dogru JSON formati

```bash
git add .
git commit -m "feat: add express app, server, error handler, and health check"
```

**Sik Yapilan Hatalar:**
- Error handler middleware'e 3 parametre vermek (err, req, res): Express 4 parametre BEKLER. 3 parametreli fonksiyon error handler olarak CALISMAZ, normal middleware olarak yorumlanir.
- Error handler'i route'lardan ONCE yazmak: Error handler route'lardan sonra olmali, yoksa route'lardaki hatalar yakalanmaz.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Express error handler neden tam olarak 4 parametre ister? 3 parametre olursa ne olur?
2. app.ts ve server.ts neden ayrildi? Ayrilmasaydi test yazarken ne sorun olurdu?
3. Error handler'da `isOperational` kontrolu neden onemli? Bir `TypeError` (programci hatasi) ile `AppError.notFound()` (beklenen hata) arasindaki fark nedir?

---

## RETRIEVAL PRACTICE: Phase 1 (Ertesi Gun Cevapla)

Asagidaki sorulari KODU ACMADAN, kagida veya not dosyasina yaz. Hedef: 5/7

1. Zod ile environment validation neden uygulama baslarken yapilir? Yapilmasaydi ne olurdu?
2. `z.coerce.number()` ne yapar? `z.number()`'dan farkini ornekle acikla.
3. `AppError.notFound('Habit')` cagrildiginda arka planda ne olur? Hangi degerler set edilir?
4. Static factory method pattern'i nedir? Constructor'a gore avantaji ne?
5. Docker volume silinirse ne olur? Neden volume kullaniyoruz?
6. Express error handler middleware neden 4 parametre olmak ZORUNDA?
7. app.ts ve server.ts neden ayri dosyalarda? Tek dosyada olsa ne sorun olur?

7 uzerinden 5'in altindaysan Phase 1'i tekrar gozden gecir.

---

## MULAKAT REHBERI: Phase 1

**S: Projelerinizde error handling nasil yapiyorsunuz?**
C: "Projemde custom AppError sinifi kullandim. Static factory method'larla (badRequest, notFound, conflict gibi) error olusturuyorum. Her error'un statusCode, message ve code field'i var. Global error handler middleware tum hatalari yakaliyor ve tutarli JSON formati donduruyor. isOperational flag'i ile operational error ve programmer error ayirimi yapiyorum."
Projenle Kanitla: "Ornegin kullanici bulunamadiginda `AppError.notFound('User')` cagiriyorum, bu otomatik olarak 404 status ve 'User not found' mesaji donduruyor."

**S: Environment variable'lari nasil yonetiyorsunuz?**
C: "Uygulama baslarken Zod ile tum environment variable'lari validate ediyorum. Eksik veya hatali degisken varsa uygulama BASLAMAZ — bu sayede production'da runtime hatalari onleniyor. Typed bir env objesi export edip tum projede kullaniyorum."
Projenle Kanitla: "env.ts dosyamda PORT z.coerce.number() ile validate edilir — string'den number'a donusum garanti."

**S: Docker neden kullaniyorsunuz?**
C: "Gelistirme ortaminda PostgreSQL'i Docker Compose ile ayaga kaldiriyorum. Bu sayede her gelistirici `docker compose up -d` ile ayni ortami olusturabiliyor. 'Bende calisiyor ama sende calismiyor' problemi ortadan kalkiyor."

---

# Phase 2: Auth (Gun 2 — ~70 dk)

> Scaffolding seviyesi: **YUKSEK** — Adimlar detayli ama Phase 1'den biraz daha az.

---

## ISINAN: Phase 1 Tekrari (5 dakika)

Kodu ACMADAN cevapla:
1. `AppError.conflict('Email already exists')` cagrildiginda statusCode kac olur?
2. Express error handler kac parametre alir ve neden?
3. `.env` dosyasi neden git'e eklenmez?

Cevaplayamadiysan Phase 1'e don.

---

### Gorev 2.1 — Users Schema + Migration

**Hedef:** Users tablosunun Drizzle schema'sini yaz ve migration calistir.
**Gercek Dunya:** Schema-first yaklasim: once veritabani yapisini tanimla, sonra uygulama kodunu yaz. Drizzle Kit schema'dan otomatik SQL migration olusturur — elle SQL yazma hatalarina karsi korur.
**Tahmini Sure:** 10-12 dakika

#### Adim 1: src/db/schema/users.ts dosyasi olustur
- `import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';`
- Arama Terimi: "drizzle orm pgTable define schema typescript"
- Kontrol: dosya olusmus, import var

#### Adim 2: users tablosunu tanimla
- `export const users = pgTable('users', { ... });`
- Sutunlar: `id` (serial, primaryKey), `email` (varchar 255, notNull, unique), `passwordHash` (varchar 255, notNull), `name` (varchar 100, notNull), `createdAt` (timestamp, defaultNow, notNull), `updatedAt` (timestamp, defaultNow, notNull)
- Arama Terimi: "drizzle orm serial varchar timestamp default now"
- Kontrol: users degiskeni export ediliyor

#### Adim 3: src/db/index.ts olustur
- `export * from './schema/users';`
- Bu dosya ileride tum schema'lari export edecek
- Kontrol: dosya olusmus

#### Adim 4: Migration olustur ve calistir
- `npm run db:generate` — Drizzle Kit SQL migration dosyasi olusturur
- `npm run db:migrate` — Migration'i veritabaninda calistirir
- Kontrol: `drizzle/` klasorunde SQL dosyasi olusmus, PostgreSQL'de `users` tablosu var

```bash
git add .
git commit -m "feat: add users schema and run initial migration"
```

**Sik Yapilan Hatalar:**
- Drizzle schema'da `passwordHash` yazarken veritabaninda `password_hash` olmasi: Drizzle camelCase'i otomatik snake_case'e cevirir YALNIZCA `varchar('password_hash')` seklinde sutun adini belirtirsen. Belirtmezsen JS property adi kullanilir.
- Docker'daki PostgreSQL kapali iken migration calistirmak: Once `docker compose up -d` calistir.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. `serial('id').primaryKey()` ne yapar? SQL'de karsiligi nedir?
2. Migration dosyasi neden git'e eklenmeli? Eklenmezse takim calismasinda ne olur?
3. `defaultNow()` neden uygulama katmaninda degil veritabani katmaninda yapilir?

---

### Gorev 2.2 — Password Hashing + JWT Utility

**Hedef:** Sifre hashleme ve JWT olusturma/dogrulama utility'lerini yaz.
**Gercek Dunya:** Plain-text sifre saklamak guvenlikteki en buyuk hatalardan biri. bcrypt salt + hash ile her sifreyi benzersiz hale getirir. JWT ise stateless authentication saglar — her request'te veritabanina sorgu atmana gerek kalmaz.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: src/utils/password.ts olustur
- `import bcrypt from 'bcryptjs';`
- `export async function hashPassword(password: string): Promise<string>`
- `bcrypt.hash(password, 12)` — salt rounds = 12
- Arama Terimi: "bcryptjs hash compare typescript async"
- Kontrol: dosya olusmus, fonksiyon export ediliyor

#### Adim 2: comparePassword fonksiyonu ekle
- `export async function comparePassword(password: string, hash: string): Promise<boolean>`
- `bcrypt.compare(password, hash)`
- Kontrol: iki fonksiyon export ediliyor

#### Adim 3: src/utils/jwt.ts olustur
- `import jwt from 'jsonwebtoken';`
- `import env from '../config/env';`
- Kontrol: dosya olusmus, import'lar var

#### Adim 4: generateToken fonksiyonu yaz
- `export function generateToken(payload: { userId: number }): string`
- `jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })`
- Arama Terimi: "jsonwebtoken sign verify typescript"
- Kontrol: fonksiyon export ediliyor

#### Adim 5: verifyToken fonksiyonu yaz
- `export function verifyToken(token: string): { userId: number }`
- `jwt.verify(token, env.JWT_SECRET)` — try/catch ile, hata durumunda `AppError.unauthorized()` firlat
- Kontrol: iki fonksiyon export ediliyor

```bash
git add .
git commit -m "feat: add password hashing and JWT utilities"
```

**Sik Yapilan Hatalar:**
- Salt rounds'u 1-2 gibi dusuk tutmak: Brute force saldirisi kolaylasir. 10-12 standarttir.
- JWT secret'i kisa tutmak (.env'de "secret" gibi): Kolayca tahmin edilir. Minimum 32 karakter kullan.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. bcrypt neden her hash'te farkli sonuc uretir? Ayni sifreyi iki kez hash'lersen ayni sonuc cikar mi?
2. JWT token'in icinde ne saklanir? Token'i decode edince ne gorursun?
3. `expiresIn: '7d'` ne anlama gelir? Token suresi dolunca ne olur?

---

### Gorev 2.3 — Auth Repository + Service

**Hedef:** Kullanici veritabani islemlerini (repository) ve is mantigi katmanini (service) olustur.
**Gercek Dunya:** Repository pattern veritabani sorgularini tek bir yerde toplar. Service pattern is mantigini (sifre hash, JWT uretme, duplicate kontrol) toplar. Controller bu iki katmani kullanir. Bu sayede veritabanini degistirirsen sadece repository'ye dokunursun.
**Tahmini Sure:** 15-18 dakika

#### Adim 1: src/modules/auth/auth.repository.ts olustur
- `import { db } from '../../config/database';`
- `import { users } from '../../db';`
- `import { eq } from 'drizzle-orm';`
- Kontrol: dosya olusmus, import'lar var

#### Adim 2: findByEmail fonksiyonu yaz
- `export async function findByEmail(email: string)` — `db.select().from(users).where(eq(users.email, email))`
- Ilk sonucu dondur (array'den [0])
- Arama Terimi: "drizzle orm select where eq typescript"
- Kontrol: fonksiyon export ediliyor

#### Adim 3: createUser fonksiyonu yaz
- `export async function createUser(data: { email: string; passwordHash: string; name: string })`
- `db.insert(users).values(data).returning()`
- `returning()` ile olusturulan kaydi geri al
- Arama Terimi: "drizzle orm insert returning typescript"
- Kontrol: fonksiyon export ediliyor

#### Adim 4: src/modules/auth/auth.service.ts olustur
- Repository fonksiyonlarini import et
- `hashPassword`, `comparePassword`, `generateToken` import et
- `AppError` import et
- Kontrol: dosya olusmus, import'lar var

#### Adim 5: register fonksiyonu yaz
- Email ile kullanici ara (findByEmail) — varsa `AppError.conflict('Email already registered')` firlat
- Sifreyi hashle (hashPassword)
- Kullaniciyi olustur (createUser)
- Token uret (generateToken)
- `{ user: { id, email, name, createdAt }, token }` dondur (passwordHash DONME)
- Kontrol: fonksiyon export ediliyor

#### Adim 6: login fonksiyonu yaz
- Email ile kullanici ara — yoksa `AppError.unauthorized('Invalid credentials')` firlat
- Sifreyi karsilastir (comparePassword) — yanlissa ayni hatayi firlat (guvenlik: hangi field'in yanlis oldugunu SOYLEME)
- Token uret, user + token dondur
- Kontrol: fonksiyon export ediliyor

```bash
git add .
git commit -m "feat: add auth repository and service with register/login"
```

**Sik Yapilan Hatalar:**
- Login'de "Email not found" ve "Wrong password" seklinde AYRI hata mesajlari vermek: Saldirgana hangi field'in dogru oldugunu soylemis olursun. Her zaman generic "Invalid credentials" dondur.
- Response'da passwordHash dondurmek: User objesinden passwordHash'i CIKAR, sonra dondur.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Repository pattern ne ise yarar? Service'te direkt `db.select()` yazsak ne olur?
2. Login'de neden "Email not found" ve "Wrong password" ayri hata mesajlari VERILMEZ?
3. `returning()` ne yapar? Kullanmasak olusturulan kaydin id'sini nasil ogrenirdik?

---

### Gorev 2.4 — Auth Validation + Controller + Routes

**Hedef:** Input validation schemalarini, controller'i ve route'lari olustur.
**Gercek Dunya:** Kullanicidan gelen veri ASLA guvenilir degildir. Zod ile her input validate edilir. Controller HTTP katmanidir — request'ten veriyi alir, service'i cagirir, response dondurur. Isin icinde is mantigi YOKTUR.
**Tahmini Sure:** 15-18 dakika

#### Adim 1: src/middlewares/validate.ts olustur
- `import { ZodSchema } from 'zod';`
- `import { Request, Response, NextFunction } from 'express';`
- `import { AppError } from '../utils/app-error';`
- Middleware fonksiyonu: `(schema: ZodSchema) => (req, res, next) => { ... }`
- `schema.parse(req.body)` — basarili ise `next()`, basarisiz ise `AppError.badRequest(hata mesaji)` firlat
- Arama Terimi: "zod express validation middleware typescript"
- Kontrol: dosya olusmus, fonksiyon export ediliyor

#### Adim 2: src/modules/auth/auth.validation.ts olustur
- `registerSchema`: `z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2).max(100) })`
- `loginSchema`: `z.object({ email: z.string().email(), password: z.string().min(1) })`
- Arama Terimi: "zod object email string min validation"
- Kontrol: dosya olusmus, iki schema export ediliyor

#### Adim 3: src/modules/auth/auth.controller.ts olustur
- `import * as authService from './auth.service';`
- `import { apiResponse } from '../../utils/api-response';`
- Kontrol: dosya olusmus

#### Adim 4: register controller fonksiyonu yaz
- `export async function register(req: Request, res: Response, next: NextFunction)`
- try/catch: `authService.register(req.body)` cagir, sonucu `apiResponse.success(res, result, 201)` ile dondur
- catch'te `next(err)` — error handler'a yonlendir
- Kontrol: fonksiyon export ediliyor

#### Adim 5: login controller fonksiyonu yaz
- Ayni pattern: `authService.login(req.body)`, sonucu `apiResponse.success(res, result)` ile dondur
- Kontrol: fonksiyon export ediliyor

#### Adim 6: src/modules/auth/auth.routes.ts olustur
- `import { Router } from 'express';`
- `const router = Router();`
- `router.post('/register', validate(registerSchema), register);`
- `router.post('/login', validate(loginSchema), login);`
- `export default router;`
- Arama Terimi: "express router typescript separate file"
- Kontrol: dosya olusmus, router export ediliyor

#### Adim 7: Route'u app.ts'e bagla
- `import authRoutes from './modules/auth/auth.routes';`
- `app.use('/api/auth', authRoutes);`
- Kontrol: `npm run dev`, Postman'den `POST /api/auth/register` cagir, kullanici olusur

```bash
git add .
git commit -m "feat: add auth validation, controller, and routes"
```

**Sik Yapilan Hatalar:**
- Controller'da try/catch unutmak: Hata firladiginda Express crash olur. Her async controller try/catch + next(err) icermeli.
- Validation middleware'i route'a eklemeyi unutmak: Body validate edilmeden service'e gider, beklenmedik hatalar olusur.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Controller'da is mantigi (sifre hashleme, duplicate kontrol) yazsak neden sorun olur?
2. Validation middleware neden route taniminda controller'dan ONCE yazilir?
3. `next(err)` ne yapar? Cagirilmazsa hata nereye gider?

---

### Gorev 2.5 — Auth Middleware (Route Protection)

**Hedef:** JWT token kontrolu yapan middleware yaz, korunmus route'lara eris.
**Gercek Dunya:** API'nin cogu endpoint'i sadece giris yapmis kullanicilara acik olmali. Auth middleware her request'te token'i kontrol eder, gecersizse 401 dondurur. Bu middleware tum korunmus route'larda kullanilir.
**Tahmini Sure:** 10-12 dakika

#### Adim 1: src/middlewares/authenticate.ts olustur
- `import { Request, Response, NextFunction } from 'express';`
- `import { verifyToken } from '../utils/jwt';`
- `import { AppError } from '../utils/app-error';`
- Kontrol: dosya olusmus

#### Adim 2: authenticate middleware fonksiyonunu yaz
- Authorization header'indan token'i al: `req.headers.authorization?.split(' ')[1]`
- Token yoksa `AppError.unauthorized()` firlat
- `verifyToken(token)` ile dogrula
- `req.user = { userId }` seklinde request'e ekle (TypeScript icin type extension gerekir)
- `next()` cagir
- Arama Terimi: "express jwt authentication middleware bearer token typescript"
- Kontrol: fonksiyon export ediliyor

#### Adim 3: Express Request tipini genislet
- `src/types/express.d.ts` dosyasi olustur
- `declare namespace Express { interface Request { user?: { userId: number } } }`
- Arama Terimi: "extend express request interface typescript declaration"
- Kontrol: `req.user.userId` TypeScript hatasi vermiyor

#### Adim 4: Test et
- Postman'den `POST /api/auth/register` ile kullanici olustur, token'i al
- `GET /api/health` yerine korunmus bir endpoint olmadigi icin simdilik sadece middleware'in DERLENMESINI kontrol et
- `npx tsc --noEmit` hatasiz calissin
- Kontrol: TypeScript hata vermiyor

```bash
git add .
git commit -m "feat: add JWT authentication middleware"
```

**Sik Yapilan Hatalar:**
- `Authorization: Bearer <token>` formatini yanlis parse etmek: `split(' ')` ile ayir, index [1]'i al. "Bearer" kelimesini dahil etme.
- TypeScript type extension dosyasini olusturmamak: `req.user` icin "Property does not exist" hatasi alirsin.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. "Bearer" token nedir? Neden sadece token degil de "Bearer <token>" formatinda gonderilir?
2. Auth middleware `req.user`'a veri ekliyor — bu pattern'e ne denir ve neden faydali?
3. JWT verify basarisiz olursa (suresi dolmus, gecersiz secret) ne olur?

---

## RETRIEVAL PRACTICE: Phase 2 (Ertesi Gun Cevapla)

Asagidaki sorulari KODU ACMADAN, kagida veya not dosyasina yaz. Hedef: 5/7

1. bcrypt neden her hash isleminde farkli sonuc uretir? `comparePassword` bunu nasil cozuyor?
2. JWT token'in icinde ne bilgi saklanir? Token'i kim olusturur, kim dogrular?
3. Login endpoint'te neden "Email not found" ve "Wrong password" AYRI mesajlar verilmez?
4. Repository pattern ile Service pattern arasindaki sorumluluk farki nedir?
5. Controller'da neden is mantigi OLMAMALI? Is mantigi nereye yazilir?
6. Validation middleware route'da neden controller'dan ONCE yazilir?
7. `req.user` TypeScript'te neden hata verir? Nasil cozulur?

7 uzerinden 5'in altindaysan Phase 2'yi tekrar gozden gecir.

---

## MULAKAT REHBERI: Phase 2

**S: Authentication nasil implement ettiniz?**
C: "JWT-based stateless authentication kullandim. Register'da sifre bcrypt ile hash'lenir (salt rounds: 12), login'de comparePassword ile dogrulanir. Basarili giris sonrasi JWT token uretilir. Her korunmus endpoint'e auth middleware ekledim — Authorization header'dan Bearer token'i alir, verify eder, req.user'a userId ekler."
Projenle Kanitla: "Login'de guvenlik icin 'Invalid credentials' generic mesaji kullaniyorum — email mi sifre mi yanlis soylenmez."

**S: Layered architecture nedir? Neden kullandiniz?**
C: "Repository, Service, Controller katmanlarini ayirdim. Repository sadece veritabani islemlerini, Service is mantigini (validation, hashing, duplicate kontrol), Controller HTTP katmanini (request parse, response dondurme) yapar. Bu sayede veritabanini degistirmek istesem sadece repository'ye dokunurum, service ve controller ayni kalir."
Projenle Kanitla: "Auth modulumde auth.repository.ts, auth.service.ts, auth.controller.ts, auth.routes.ts ayri dosyalarda."

---

# Phase 3: Habits + Tracking (Gun 3, Birinci Yari — ~75 dk)

> Scaffolding seviyesi: **ORTA** — Fonksiyon adi ve amaci verilir, bazi implementasyon detaylari kullanicida.

---

## ISINAN: Phase 2 Tekrari (5 dakika)

Kodu ACMADAN cevapla:
1. `hashPassword` fonksiyonu ne dondurur? Ayni sifreyi iki kez hash'lersen sonuc ayni mi?
2. Auth middleware `req.user`'a ne ekler? Bu bilgi nereden gelir?
3. Register service'te email duplicate kontrolu nasil yapilir?

Cevaplayamadiysan Phase 2'ye don.

---

### Gorev 3.1 — Habits + DailyLogs + Quotes Schema + Migration

**Hedef:** Uc tablonun Drizzle schema'sini yaz ve migration calistir.
**Gercek Dunya:** Iliski tasarimi (foreign key, unique constraint) veritabani seviyesinde veri butunlugunu saglar. Uygulama cokse bile veritabani tutarsiz veri kabul etmez.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: src/db/schema/habits.ts olustur
- habits tablosu: id, user_id (FK → users), name, cue, routine, reward, is_active, created_at, updated_at
- `user_id` icin: `.references(() => users.id, { onDelete: 'cascade' })`
- Arama Terimi: "drizzle orm foreign key references onDelete cascade"
- Kontrol: dosya olusmus, export var

#### Adim 2: src/db/schema/daily-logs.ts olustur
- daily_logs tablosu: id, habit_id (FK → habits), user_id (FK → users), date, completed, created_at
- UNIQUE constraint: `(habit_id, date)` — ayni aliskanlik ayni gunde iki kez loglanamaz
- Arama Terimi: "drizzle orm unique constraint multiple columns"
- Kontrol: dosya olusmus, unique constraint tanimli

#### Adim 3: src/db/schema/quotes.ts olustur
- quotes tablosu: id, content (text), author, source, created_at
- Kontrol: dosya olusmus

#### Adim 4: src/db/index.ts'i guncelle
- Tum schema'lari export et: `export * from './schema/users'`, `./schema/habits`, `./schema/daily-logs`, `./schema/quotes`
- Kontrol: 4 schema dosyasi export ediliyor

#### Adim 5: Migration olustur ve calistir
- `npm run db:generate && npm run db:migrate`
- Kontrol: PostgreSQL'de 4 tablo var (users, habits, daily_logs, quotes)

```bash
git add .
git commit -m "feat: add habits, daily_logs, and quotes schemas"
```

**Sik Yapilan Hatalar:**
- Unique constraint'i schema'da tanimlamayi unutmak: Ayni aliskanlik ayni gunde birden fazla kez loglanabilir — veri tutarsizligi olusur.
- `onDelete: 'cascade'` eklemeyi unutmak: Kullanici silindiginde aliskanliklari yetim kalir (orphaned records).

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. `ON DELETE CASCADE` ne yapar? Kullanici silindiginde ne olur?
2. `UNIQUE(habit_id, date)` constraint'i uygulama katmaninda da kontrol edilmeli mi yoksa sadece veritabani yeterli mi?
3. Quotes tablosu neden users ile iliskili DEGIL?

---

### Gorev 3.2 — Habits CRUD

**Hedef:** Aliskanlik olusturma, listeleme, guncelleme, silme endpoint'lerini yaz.
**Gercek Dunya:** CRUD her API'nin temelidir. Ama iyi CRUD; ownership kontrolu (sadece kendi aliskanliklarini gor), input validation ve tutarli response formati icerir.
**Tahmini Sure:** 18-20 dakika

#### Adim 1: habits.validation.ts olustur
- `createHabitSchema`: name (string, min 1, max 100), cue (string, min 1, max 255), routine (string, min 1, max 255), reward (string, min 1, max 255)
- `updateHabitSchema`: tum field'lar optional (`.partial()` veya her biri `.optional()`)
- `idParamSchema`: `z.object({ id: z.coerce.number().int().positive() })`
- Kontrol: 3 schema export ediliyor

#### Adim 2: habits.repository.ts olustur
- `findAllByUserId(userId)` — kullanicinin tum aktif aliskanliklari
- `findById(id)` — tek aliskanlik
- `create(data)` — yeni aliskanlik, `.returning()`
- `update(id, data)` — guncelle, `.returning()`
- `remove(id)` — sil
- Arama Terimi: "drizzle orm update set where returning"
- Kontrol: 5 fonksiyon export ediliyor

#### Adim 3: habits.service.ts olustur
- `getAll(userId)` — repository.findAllByUserId cagir
- `getById(userId, habitId)` — bul, ownership kontrol et (habit.userId === userId), yoksa AppError.notFound, sahip degilse AppError.forbidden
- `create(userId, data)` — userId ekle, repository.create cagir
- `update(userId, habitId, data)` — ownership kontrol et, repository.update cagir
- `remove(userId, habitId)` — ownership kontrol et, repository.remove cagir
- Kontrol: 5 fonksiyon export ediliyor

#### Adim 4: habits.controller.ts olustur
- Her fonksiyon: `req.user!.userId`'den userId al, service'i cagir, apiResponse ile dondur
- try/catch + next(err) pattern'i
- Kontrol: 5 controller fonksiyonu

#### Adim 5: habits.routes.ts olustur
- `router.get('/', authenticate, getAll)`
- `router.post('/', authenticate, validate(createHabitSchema), create)`
- `router.get('/:id', authenticate, getById)`
- `router.patch('/:id', authenticate, validate(updateHabitSchema), update)`
- `router.delete('/:id', authenticate, remove)`
- Kontrol: 5 route tanimli

#### Adim 6: app.ts'e bagla ve test et
- `app.use('/api/habits', habitsRoutes);`
- Postman ile test: register → token al → POST /api/habits ile aliskanlik olustur → GET /api/habits ile listele
- Kontrol: CRUD islemleri calisiyor

```bash
git add .
git commit -m "feat: add habits CRUD with ownership validation"
```

**Sik Yapilan Hatalar:**
- Ownership kontrolu UNUTMAK: Bir kullanici baska kullanicinin aliskanligini gorebilir/silebilir — kritik guvenlik acigi.
- PATCH'te bos body gonderince tum field'lari null yapmak: `updateHabitSchema`'da field'lar optional olmali, sadece gonderilen field'lar guncellenmeli.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Ownership kontrolu neden service katmaninda yapilir, controller'da degil?
2. PUT ile PATCH arasindaki fark nedir? Neden PATCH tercih ettik?
3. `.returning()` olmadan create islemi sonucu nasil ogrenirsin?

---

### Gorev 3.3 — Daily Completion Toggle

**Hedef:** Bir aliskanligi bugün icin "tamamlandı/tamamlanmadi" olarak isaretle.
**Gercek Dunya:** Toggle pattern: ayni endpoint'e iki kez istek atarsan durumu geri alir. Kullanici yanlislikla tamamladi isaretlerse tekrar atarak geri alabilir. UX dostu bir yaklasim.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: habits.repository.ts'e daily log fonksiyonlari ekle
- `findDailyLog(habitId, date)` — belirli gun icin log var mi?
- `createDailyLog(data)` — yeni log olustur
- `deleteDailyLog(id)` — log sil (toggle icin)
- Arama Terimi: "drizzle orm and operator multiple where conditions"
- Kontrol: 3 yeni fonksiyon eklendi

#### Adim 2: habits.service.ts'e toggle fonksiyonu ekle
- `toggleToday(userId, habitId)` fonksiyonu:
- Aliskanligin varligini ve ownership'ini kontrol et
- Bugunun tarihini al (YYYY-MM-DD formatinda)
- O gun icin log var mi kontrol et (findDailyLog)
- Varsa sil (deleteDailyLog) — toggle OFF
- Yoksa olustur (createDailyLog) — toggle ON
- `{ completed: true/false, date }` dondur
- Kontrol: fonksiyon export ediliyor

#### Adim 3: habits.controller.ts'e toggleToday ekle
- `req.params.id`'den habitId al
- Service'i cagir, sonucu dondur
- Kontrol: controller fonksiyonu var

#### Adim 4: habits.routes.ts'e route ekle
- `router.post('/:id/toggle', authenticate, toggleToday)`
- Kontrol: route tanimli

#### Adim 5: Postman ile test et
- POST /api/habits/:id/toggle — `{ completed: true }` donmeli
- Ayni endpoint'e tekrar at — `{ completed: false }` donmeli
- Kontrol: toggle calisiyor

```bash
git add .
git commit -m "feat: add daily habit completion toggle"
```

**Sik Yapilan Hatalar:**
- Tarih karsilastirmasinda timezone sorunu: `new Date().toISOString().split('T')[0]` ile YYYY-MM-DD formatinda calis. Saat/dakika farki toggle'i bozabilir.
- Unique constraint hatasi yakalamamak: Ayni gunde iki kez olusturma denemesi DB hatasi verir. Toggle mantigi bunu onler ama race condition olabilir.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Toggle pattern neden ayri create ve delete endpoint'lerinden daha iyi bir UX?
2. Tarih karsilastirmasinda neden saat bilgisi OLMAMALI?
3. Iki kullanici ayni anda toggle atarsa ne olur? (race condition)

---

### Gorev 3.4 — Streak Calculation + Stats

**Hedef:** Bir aliskanlik icin ardisik gun sayisini (streak) ve tamamlanma oranini hesapla.
**Gercek Dunya:** Streak, Atomic Habits'in "don't break the chain" prensibinin teknik uygulamasi. Kullanicinin motivasyonunu ayakta tutan en guclu metrik. Completion rate ise uzun vadeli goruntuyu verir.
**Tahmini Sure:** 15-18 dakika

#### Adim 1: habits.repository.ts'e istatistik sorgulari ekle
- `findLogsByHabitId(habitId)` — tum loglar, tarihe gore AZALAN sirada
- `countCompletedLogs(habitId)` — toplam tamamlanmis gun sayisi
- Arama Terimi: "drizzle orm orderBy desc count aggregate"
- Kontrol: 2 yeni fonksiyon

#### Adim 2: habits.service.ts'e streak hesaplama fonksiyonu yaz
- `getStats(userId, habitId)` fonksiyonu:
- Ownership kontrol et
- Tum log'lari al (tarihe gore azalan sira)
- Streak hesapla: bugun veya dunden baslayarak ardisik gunleri say
- Algoritma: bugunun tarihinden geriye git, her gun icin log var mi kontrol et, ilk bos gunde dur
- Toplam tamamlanma sayisini al
- Aliskanligin olusturulma tarihinden bu yana gecen gun sayisini hesapla
- `{ currentStreak, totalCompleted, completionRate, longestStreak }` dondur
- Arama Terimi: "calculate streak consecutive days javascript algorithm"
- Kontrol: fonksiyon export ediliyor

#### Adim 3: habits.controller.ts'e getStats ekle
- `req.params.id`'den habitId al
- Service'i cagir, sonucu dondur
- Kontrol: controller fonksiyonu var

#### Adim 4: habits.routes.ts'e route ekle
- `router.get('/:id/stats', authenticate, getStats)`
- Kontrol: route tanimli

#### Adim 5: Test et
- Bir aliskanlik olustur, 3 gun ust uste toggle et (gunleri simule etmek icin direkt daily_logs tablosuna farkli tarihlerle kayit atabilirsin)
- GET /api/habits/:id/stats — streak: 3 donmeli
- Kontrol: streak ve istatistikler dogru

```bash
git add .
git commit -m "feat: add streak calculation and habit statistics"
```

**Sik Yapilan Hatalar:**
- Streak hesaplamada bugun henuz loglanmamissa streak'i 0 gostermek: Dun loglanmissa streak devam ediyor demektir. Bugun VE dun kontrol et.
- Tarih farki hesaplarken timezone'u goz ardi etmek: Tum tarihleri UTC'de isle.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Streak hesaplama algoritmasi ne yapar? Bugun loglamamis ama dun loglamis birinin streak'i kac?
2. Completion rate nasil hesaplanir? Hangi tarih araligini baz aliyorsun?
3. Bu istatistik endpoint'i her cagrildiginda veritabanina sorgu atiyor — cok fazla kullanici olsa ne yapardin? (ipucu: caching)

---

### Gorev 3.5 — Quotes Seed + Daily Quote Endpoint

**Hedef:** Motivasyon cumleleri tablosunu doldur ve gunluk cumle endpoint'i olustur.
**Gercek Dunya:** Seed data, uygulamanin ilk calistiginda anlamli icerigi olmasi icin gerekli. Daily quote endpoint, uygulamanin "ruhunu" olusturur — evidence-based prensiplerle her gun yeni bir motivasyon.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: src/db/seed.ts olustur
- db baglantisini import et, quotes schema'sini import et
- 15 motivasyon cumlesini array olarak tanimla (asagidaki kaynaklardan):
  - BJ Fogg, Tiny Habits: "People change best by feeling good, not by feeling bad." / "There's a tiny version of every habit you want." / "Simplicity changes behavior." / "Celebrate immediately to wire in the habit." / "After I [anchor], I will [tiny behavior]."
  - James Clear, Atomic Habits: "You do not rise to the level of your goals. You fall to the level of your systems." / "Every action is a vote for the type of person you wish to become." / "Habits are the compound interest of self-improvement." / "Make it obvious. Make it attractive. Make it easy. Make it satisfying." / "The secret to lasting change is to focus on identity, not outcomes."
  - Arastirma prensipleri: "Implementation intentions increase goal achievement by 2-3x. — Gollwitzer & Sheeran" / "Small consistent actions beat large inconsistent ones. — BJ Fogg" / "Don't break the chain. — Jerry Seinfeld" / "What is rewarded is repeated. What is punished is avoided. — James Clear" / "Motivation is unreliable. Design is what matters. — BJ Fogg"
- `db.insert(quotes).values(quotesArray)` ile toplu ekle
- Arama Terimi: "drizzle orm insert multiple rows seed data"
- Kontrol: `npm run db:seed` calistir, quotes tablosunda 15 kayit var

#### Adim 2: quotes.repository.ts olustur
- `findAll()` — tum quotes
- `countAll()` — toplam sayi
- Kontrol: 2 fonksiyon

#### Adim 3: quotes.service.ts olustur
- `getTodayQuote()` fonksiyonu:
- Yilin kacinci gunu oldugunu hesapla (dayOfYear)
- `index = dayOfYear % totalQuotes`
- O index'teki quote'u dondur
- Bu sayede her gun ayni quote, herkes icin ayni
- Arama Terimi: "javascript get day of year from date"
- Kontrol: fonksiyon deterministik — ayni gun ayni sonuc

#### Adim 4: quotes.controller.ts + quotes.routes.ts olustur
- `getTodayQuote` controller ve route
- Route: `router.get('/today', authenticate, getTodayQuote)`
- Kontrol: endpoint calisiyor

#### Adim 5: app.ts'e bagla ve test et
- `app.use('/api/quotes', quotesRoutes);`
- GET /api/quotes/today — bir motivasyon cumlesi donmeli
- Kontrol: JSON formatinda quote, author, source donuyor

```bash
git add .
git commit -m "feat: add motivational quotes with daily rotation"
```

**Sik Yapilan Hatalar:**
- Seed'i birden fazla kez calistirinca duplicate kayitlar olusur: Seed basinda `db.delete(quotes)` ile tabloyu temizle veya `ON CONFLICT DO NOTHING` kullan.
- dayOfYear hesaplamasinda yanlis formul: Ocak 1 = 1, Aralik 31 = 365. Formul: `Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))`

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. `dayOfYear % totalQuotes` formulu ne yapar? Yeni quote eklenince ne degisir?
2. Seed data neden ayri bir dosyada ve migration'dan ayri? Ikisi farkli ne zaman calisir?
3. Bu endpoint icin caching eklemek istesen nasil yapardim? (ipucu: gunde 1 kez degisiyor)

---

## RETRIEVAL PRACTICE: Phase 3 (Ertesi Gun Cevapla)

Asagidaki sorulari KODU ACMADAN, kagida veya not dosyasina yaz. Hedef: 5/7

1. UNIQUE(habit_id, date) constraint'i ne yapar? Olmasaydi ne olurdu?
2. Toggle pattern nasil calisir? Ayni endpoint'e iki kez atinca ne olur?
3. Streak hesaplamada bugun loglanmamis ama dun loglanmissa streak kac?
4. Ownership kontrolu neden onemli? Kontrol olmasaydi ne olurdu?
5. `ON DELETE CASCADE` foreign key'de ne yapar? users silinince ne olur?
6. dayOfYear % totalQuotes formulu ne yapar? 366. gunde ne olur?
7. PUT ile PATCH arasindaki fark nedir? Bu projede neden PATCH secildi?

7 uzerinden 5'in altindaysan Phase 3'u tekrar gozden gecir.

---

## MULAKAT REHBERI: Phase 3

**S: Bir API'de veri butunlugunu nasil sagliyorsunuz?**
C: "Veritabani seviyesinde foreign key ve unique constraint kullaniyorum. Ornegin daily_logs tablosunda UNIQUE(habit_id, date) var — ayni aliskanlik ayni gunde iki kez loglanamaz. ON DELETE CASCADE ile kullanici silindiginde iliskili tum kayitlar otomatik temizleniyor. Uygulama katmaninda ise ownership kontrolu yapiyorum — bir kullanici sadece kendi aliskanliklarini gorebilir ve duzenleyebilir."
Projenle Kanitla: "Toggle endpoint'im ayni gune iki kez istek atildiginda log'u siler — unique constraint ihlali yerine akilli toggle davranisi."

**S: Bu projede kullandiginiz en ilginc algoritma nedir?**
C: "Streak hesaplama. Kullanicinin ardisik kac gun aliskanligini tamamladigini hesapliyorum. Bugunun tarihinden geriye gidip her gun icin log kontrolu yapiyorum, ilk bos gunde duruyorum. Bugun henuz loglanmamissa dune bakiyorum — streak 'kirilmamis' olabilir. Bu Atomic Habits'teki 'don't break the chain' prensibinin teknik implementasyonu."

---

# Phase 4: Ship It (Gun 3, Ikinci Yari — ~45 dk)

> Scaffolding seviyesi: **DUSUK** — Sadece ne yapilacagi soylenir, nasil buyuk olcude kullanicida.

---

## ISINAN: Phase 3 Tekrari (5 dakika)

Kodu ACMADAN cevapla:
1. Streak hesaplama algoritmasi nasil calisir? Kac adimda?
2. Quotes tablosunun diger tablolarla iliskisi var mi? Neden?
3. Habits CRUD'da ownership kontrolu hangi katmanda yapilir?

Cevaplayamadiysan Phase 3'e don.

---

### Gorev 4.1 — Swagger/OpenAPI Documentation

**Hedef:** Tum endpoint'leri Swagger UI ile dokumante et.
**Gercek Dunya:** API dokumantasyonu olmadan frontend gelistirici veya mobil gelistirici senin API'ni KULLANAMAZ. Swagger hem dokumantasyon hem test araci — browser'dan endpoint'leri deneyebilirsin. Portfolyoda canli Swagger linki = profesyonellik.
**Tahmini Sure:** 12-15 dakika

#### Adim 1: Swagger yapilandirmasi olustur
- `swagger-jsdoc` ile Swagger spec olustur
- openapi: "3.0.0", info (title: "HabitForge API", version: "1.0.0", description), servers
- Arama Terimi: "swagger-jsdoc express typescript setup openapi 3"
- Kontrol: spec objesi olusuyor

#### Adim 2: Route dosyalarinin basina JSDoc comment'leri ekle
- Her endpoint icin `@swagger` tag'i: path, method, description, parameters, requestBody, responses
- En az 4 endpoint'i dokumante et (register, login, create habit, get habits)
- Arama Terimi: "swagger jsdoc express route annotation example"
- Kontrol: comment'ler tanimli

#### Adim 3: app.ts'e Swagger UI ekle
- `swagger-ui-express` ile `/api/docs` path'inde Swagger UI sun
- Kontrol: `http://localhost:3000/api/docs` acildiginda Swagger UI gorunuyor

#### Adim 4: Tum endpoint'lerin gorunurlugunu kontrol et
- Swagger UI'da en az 10 endpoint gorunmeli
- Her endpoint'in method, path, description bilgisi dogru
- Kontrol: Swagger UI'dan endpoint test edilebiliyor

```bash
git add .
git commit -m "docs: add Swagger/OpenAPI documentation"
```

**Sik Yapilan Hatalar:**
- JSDoc comment formatini yanlis yazmak: `/** @swagger` ile baslamali, YAML formati dogru indent'lenmeli.
- Swagger UI path'ini route'lardan SONRA eklemek: Aslinda sirasi onemli degil ama `errorHandler`'dan ONCE olmali.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. OpenAPI spec nedir? Swagger ile farki ne?
2. API dokumantasyonu neden onemli? Kim kullanir?
3. Swagger UI disinda API dokumantasyonu icin baska araclar neler? (ipucu: Postman collection, Redoc)

---

### Gorev 4.2 — Professional README

**Hedef:** GitHub'da projeyi aciklayan profesyonel bir README yaz.
**Gercek Dunya:** README, projenin "on kapisi". Recruiter veya mulakatci ilk bunu gorur. Iyi README = "bu adam profesyonel". Kotu README = "hobby proje".
**Tahmini Sure:** 10-12 dakika

#### Adim 1: README.md olustur
- Baslik + tek cumle aciklama
- Badges (opsiyonel: Node.js, TypeScript, PostgreSQL)
- "About" bolumu: Projenin ne oldugu, bilimsel temeli (Tiny Habits, Atomic Habits, Implementation Intentions)
- Arama Terimi: "professional readme template github api project"
- Kontrol: dosya olusmus

#### Adim 2: Tech stack + Features listesi
- Kullanilan teknolojiler
- Ozellikler listesi (Tiny Habits recipe format, streak tracking, daily quotes, JWT auth, Swagger docs)
- Kontrol: en az 6 feature listelenmis

#### Adim 3: Quick start bolumu
- Prerequisites (Node.js 18+, Docker)
- Clone, install, docker compose up, env setup, migrate, seed, dev
- KOPYALA-YAPISTIR ile calisacak komutlar
- Kontrol: birileri bu adimlari takip ederek projeyi ayaga kaldirabilir

#### Adim 4: API endpoints tablosu
- Method, path, auth gerekliligi, aciklama
- Swagger docs linki
- Kontrol: 10 endpoint listelenmis

#### Adim 5: "Built with" ve "Scientific Foundation" bolumleri
- Tiny Habits (BJ Fogg) + Atomic Habits (James Clear) referanslari
- Neden evidence-based oldugunu 2-3 cumlede acikla
- Kontrol: README tamamlanmis

```bash
git add .
git commit -m "docs: add professional README"
```

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. README'de en onemli bolum hangisi? Bir mulakatci ilk neye bakar?
2. Quick Start bolumu neden "kopyala-yapistir" ile calisacak sekilde yazilmali?
3. Bilimsel temeli README'ye yazmak portfolyoda ne fark yaratir?

---

### Gorev 4.3 — Deploy to Railway

**Hedef:** API'yi Railway'e deploy et, canli URL al.
**Gercek Dunya:** Canli URL'i olan proje ile sadece GitHub'da duran proje arasinda daglar kadar fark var. Mulakatci canli linke tiklar, Swagger'i gorur, "bu adam sadece kod yazmak degil, ship etmek de biliyor" der.
**Tahmini Sure:** 10-12 dakika

#### Adim 1: Railway hesabi olustur
- https://railway.app adresine git, GitHub ile giris yap
- Arama Terimi: "railway app deploy node express free tier"
- Kontrol: hesap olusmus

#### Adim 2: Yeni proje olustur + PostgreSQL ekle
- Railway dashboard'dan "New Project" → "Deploy from GitHub repo"
- GitHub reposunu sec
- "Add Service" → "Database" → "PostgreSQL" ekle
- Kontrol: PostgreSQL servisi olusmus, DATABASE_URL otomatik tanimlanmis

#### Adim 3: Environment variable'lari ayarla
- Railway dashboard'dan: `JWT_SECRET` (guclu, rastgele, 32+ karakter), `PORT` (Railway otomatik atar, genelde 3000)
- DATABASE_URL Railway tarafindan otomatik eklenir
- Arama Terimi: "railway environment variables setup"
- Kontrol: tum env variable'lar tanimli

#### Adim 4: Deploy et ve test et
- Railway otomatik build + deploy yapar
- Canli URL'den `GET /api/health` cagir
- Canli URL'den `GET /api/docs` cagir — Swagger UI acilmali
- Kontrol: canli URL calisiyor, Swagger gorunuyor

#### Adim 5: Migration ve seed calistir (canli DB'de)
- Railway shell veya local'den canli DATABASE_URL ile: `npm run db:migrate && npm run db:seed`
- Kontrol: canli DB'de tablolar ve quotes verisi var

```bash
git add .
git commit -m "chore: configure for railway deployment"
```

**Sik Yapilan Hatalar:**
- `package.json`'da `build` ve `start` script'lerinin olmamasi: Railway `npm run build && npm start` calistirir. `build: "tsc"`, `start: "node dist/server.js"` olmali.
- JWT_SECRET'i production'da dev ile ayni tutmak: MUTLAKA farkli ve guclu bir secret kullan.

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. Railway neden `npm run build && npm start` calistirir? Development'ta neden `tsx watch` kullaniyoruz?
2. Production'da JWT_SECRET neden development ile FARKLI olmali?
3. Database migration'i production'da nasil calistirilir?

---

### Gorev 4.4 — Final Smoke Test + Git Tag

**Hedef:** Tum endpoint'leri canli URL uzerinden test et ve projeyi versiyonla.
**Gercek Dunya:** Smoke test, "en temel islevler calisiyor mu?" kontroludur. Ship ettikten sonra hicbir sey test etmeden birakma. Git tag ile versiyonlama profesyonel projelerde standarttir.
**Tahmini Sure:** 5-8 dakika

#### Adim 1: Canli URL'de tum akisi test et
- POST /api/auth/register — kullanici olustur
- POST /api/auth/login — giris yap, token al
- POST /api/habits — aliskanlik olustur (token ile)
- GET /api/habits — aliskanliklari listele
- POST /api/habits/:id/toggle — bugunu tamamla
- GET /api/habits/:id/stats — streak'i gor
- GET /api/quotes/today — gunun sozu
- Kontrol: tum endpoint'ler 200/201 donuyor

#### Adim 2: Git tag olustur
- `git tag -a v1.0.0 -m "Initial release: HabitForge API"`
- `git push origin v1.0.0`
- Kontrol: GitHub'da tag gorunuyor

```bash
git add .
git commit -m "chore: final smoke test passed"
git tag -a v1.0.0 -m "Initial release: HabitForge API"
```

---

## RETRIEVAL PRACTICE: Phase 4 (Ertesi Gun Cevapla)

Asagidaki sorulari KODU ACMADAN, kagida veya not dosyasina yaz. Hedef: 4/5

1. Swagger/OpenAPI ne ise yarar? Kim icin yazilir?
2. README'nin en onemli bolumu nedir? Neden?
3. Railway deploy sureci nasil calisir? GitHub'a push edince ne olur?
4. Production'da JWT_SECRET neden farkli olmali? Ayni olsa ne riski var?
5. Git tag ne ise yarar? Branch'ten farki ne?

5 uzerinden 4'un altindaysan Phase 4'u tekrar gozden gecir.

---

## MULAKAT REHBERI: Phase 4

**S: Bir projeyi nasil deploy ediyorsunuz?**
C: "Railway kullaniyorum. GitHub reposunu bagliyorum, PostgreSQL add-on ekliyorum, environment variable'lari ayarliyorum. Her push'ta otomatik build ve deploy oluyor. Swagger UI canli URL'de erisilebildigi icin API'yi hemen test edebiliyorum."
Projenle Kanitla: "Projemi https://[canli-url].railway.app adresinden gorebilirsiniz. /api/docs path'inde Swagger dokumantasyonu var."

**S: API dokumantasyonu icin ne kullaniyorsunuz?**
C: "swagger-jsdoc ile JSDoc comment'lerinden OpenAPI 3.0 spec olusturuyorum, swagger-ui-express ile /api/docs path'inde sunuyorum. Her endpoint'in path, method, request body, response formati ve auth gerekliligi dokumante edilmis."

---

# FINAL RETRIEVAL PRACTICE (Proje Bittikten 1 Gun Sonra)

Asagidaki 15 soruyu KODU ACMADAN cevapla. Hedef: 12/15

**Foundation:**
1. Environment validation neden uygulama baslarken yapilir?
2. AppError class'inda `isOperational` ne ise yarar?
3. app.ts ve server.ts neden ayri?

**Auth:**
4. bcrypt salt nedir ve ne yapar?
5. JWT token'in icinde ne saklanir? Token suresiz olsa ne olur?
6. Login'de neden generic "Invalid credentials" mesaji donulur?

**Architecture:**
7. Repository, Service, Controller katmanlarinin SORUMLULUKLAR arasindaki fark nedir?
8. Ownership kontrolu hangi katmanda yapilir ve neden?
9. Validation middleware neden controller'dan ONCE calisir?

**Habits:**
10. UNIQUE(habit_id, date) constraint'i ne yapar?
11. Toggle pattern nasil calisir?
12. Streak algoritmasi bugun loglanmamissa ne yapar?

**Production:**
13. Docker Compose ne ise yarar? Neden PostgreSQL'i direkt kurmadik?
14. Production'da JWT_SECRET neden farkli olmali?
15. Swagger/OpenAPI ne ise yarar?

15 uzerinden 12'nin altindaysan ilgili phase'i tekrar gozden gecir.

---

# MULAKAT REHBERI: Genel

**S: Kendinizden bahsedin.**
C: "Backend development'a odaklaniyorum. Son projem HabitForge — BJ Fogg'un Tiny Habits ve James Clear'in Atomic Habits kitaplarina dayanan evidence-based bir aliskanlik takip API'si. Node.js, Express, TypeScript, PostgreSQL ve Drizzle ORM kullandim. Layered architecture, JWT authentication, Swagger dokumantasyonu ve Railway'e deploy iceriyor."

**S: En zorlandiginiz teknik problem neydi?**
C: "Streak hesaplama. Kullanicinin ardisik kac gun aliskanligini tamamladigini hesaplamam gerekiyordu. Bugunun tarihinden geriye gidip her gun icin log kontrolu yapmam gerekti. Ek olarak, bugun henuz loglanmamissa dune bakip streak'in kirilmamis olabilecegini handle etmem gerekti. Bu bana tarih isleme ve edge case dusunme konusunda cok sey ogretti."

**S: Kod kalitenizi nasil sagliyorsunuz?**
C: "Uc katmanli yaklasim: 1) Zod ile input validation — her endpoint'e gelen veri sema ile dogrulanir. 2) Custom AppError class ile tutarli hata formati — tum hatalar ayni JSON yapisinda donuyor. 3) Layered architecture — her katmanin tek sorumlulugu var, test edilmesi ve degistirilmesi kolay."

**S: Bu projeyi olceklendirmeniz gerekseydi ne yapardniz?**
C: "Uc adim dusunurum: 1) Redis ile caching — ozellikle quotes ve stats endpoint'leri icin, gunluk degisen veriler icin cache-aside pattern. 2) Rate limiting — auth endpoint'lerinde brute force korumasi. 3) Background jobs — BullMQ ile streak hesaplama ve bildirim gonderme. Mimari zaten buna uygun — service katmanina cache eklemek controller'i etkilemiyor."

---

# PROJE BITTIKTEN SONRA

## Elinde ne var:
- 10 endpoint'li REST API (JWT auth, CRUD, streak, daily quotes)
- Evidence-based domain (Tiny Habits + Atomic Habits)
- Layered architecture (Repository → Service → Controller)
- Swagger dokumantasyonu
- Canli URL (Railway)
- Professional README
- Conventional commits ile temiz git history

## Mulakatciya ne soylersin:
"HabitForge, BJ Fogg'un Tiny Habits ve James Clear'in Atomic Habits arastirmalarina dayanan bir aliskanlik takip API'si. Her aliskanlik 'After I [cue], I will [routine], and celebrate by [reward]' formatinda — bu Tiny Habits Recipe formati. Streak hesaplama ile 'don't break the chain' prensibini, gunluk motivasyon cumleleri ile surdurulebilirligi destekliyor. Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM kullandim. Layered architecture, JWT auth, Zod validation, Swagger docs ve Railway deploy iceriyor."

---

# FUTURE ROADMAP (Ileride Eklenecekler)

Mimari bu eklemeleri destekleyecek sekilde tasarlandi. Her ekleme spesifik bir katmana dokunur, diger katmanlar ETKILENMEZ.

## v1.1 — Haftalik Rapor Endpoint'i (2-3 saat)
- `GET /api/habits/weekly-report` — son 7 gunun ozeti
- Hangi aliskanliklar tamamlandi, completion rate, en iyi/en kotu gun
- Dokunulan katman: habits.service.ts + habits.controller.ts + habits.routes.ts

## v1.2 — Redis Caching (3-4 saat)
- `npm install ioredis`
- Stats endpoint'i icin cache-aside pattern (TTL: 1 saat)
- Quotes endpoint'i icin cache (TTL: 24 saat)
- Toggle endpoint'i cache invalidation yapar
- Dokunulan katman: habits.service.ts, quotes.service.ts + yeni src/config/redis.ts

## v1.3 — Rate Limiting (1-2 saat)
- `npm install express-rate-limit`
- Auth endpoint'leri: 5 istek/dakika (brute force korumasi)
- Diger endpoint'ler: 100 istek/dakika
- Dokunulan katman: src/middlewares/rate-limit.ts + app.ts

## v2.0 — Refresh Token + Cookie (3-4 saat)
- Access token (15dk) + Refresh token (30 gun)
- Refresh token HTTP-only cookie'de saklanir
- Token rotation + reuse detection
- Dokunulan katman: auth module tamamen

## v2.1 — Background Jobs (3-4 saat)
- `npm install bullmq`
- Gunluk streak reset kontrolu
- Haftalik rapor email'i (opsiyonel)
- Dokunulan katman: yeni src/jobs/ klasoru + habits.service.ts

## v3.0 — Mobile App (ayri proje)
- React Native veya Flutter
- AYNI API'yi kullanir — sadece frontend yazilir
- Auth: ayni register/login endpoint'leri
- Habits: ayni CRUD + toggle + stats endpoint'leri
- Quotes: ayni daily quote endpoint'i

---

# BOILERPLATE LISTESI

## Her projeye tasinir (domain-bagimsiz):
- `src/config/env.ts` — environment validation
- `src/config/database.ts` — Drizzle connection
- `src/utils/app-error.ts` — custom error class
- `src/utils/api-response.ts` — response helpers
- `src/utils/password.ts` — bcrypt utilities
- `src/utils/jwt.ts` — JWT utilities
- `src/middlewares/error-handler.ts` — global error handler
- `src/middlewares/authenticate.ts` — JWT auth middleware
- `src/middlewares/validate.ts` — Zod validation middleware
- `src/modules/auth/` — auth module tamamen
- `docker-compose.yml` — PostgreSQL
- `drizzle.config.ts` — Drizzle Kit config
- `tsconfig.json`
- `.env.example`
- `.gitignore`

## Domain-spesifik (her projede farkli):
- `src/db/schema/habits.ts` — habits schema
- `src/db/schema/daily-logs.ts` — daily logs schema
- `src/db/schema/quotes.ts` — quotes schema
- `src/db/seed.ts` — seed data
- `src/modules/habits/` — habits module tamamen
- `src/modules/quotes/` — quotes module tamamen
- `README.md` — proje aciklamasi
