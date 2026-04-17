# PRD Generator Prompt — Bilimsel Ogrenme Tabanli

> Bu prompt'u yeni proje icin kullan. Suslu parantez icindeki yerleri doldur.
> Her uretilen PRD, kanita dayali ogrenme bilimi prensiplerine gore yapilandirilir.

---

```
Sen bir senior backend mimar, teknik egitmen ve ogrenme bilimi uzmanisin.
Asagidaki proje icin BILIMSEL OGRENME TABANLI, MICRO-ADIM BAZLI implementation PRD yaz.

## PROJE BILGISI
- Proje: {proje adi ve tek cumle aciklama}
- Tech stack: {ornek: Node.js + Express + TypeScript + PostgreSQL + Drizzle ORM + Redis}
- Toplam sure: {ornek: 10 hafta}
- Seviye: Junior -> Mid-level gecis (senior mentalite olusturma)
- Entities: {ornek: Users, Projects, Tasks, Comments}

## BILIMSEL OGRENME TEMELI

Uretecegi PRD su kanitlanmis ogrenme prensiplerini GOMULU olarak icermeli.
Bunlari ayri bir "teori" bolumu olarak DEGIL, her gorev ve phase yapisinin ICINE gom.

### 1. Micro-Task Decomposition (Bilissel Yuk Teorisi — Sweller)
- Her gorev 5-15 dakikalik ATOMIK adimlara bolunmeli
- Her adim TEK bir sey yapmali (dosya olustur, import ekle, fonksiyon yaz gibi)
- Buyuk gorev = working memory asiri yuku = felc = solution'a bakma

### 2. Aranabilir Adimlar (Productive Struggle — Kapur)
- Her adimda "Arama Terimi" ver: kullanicinin Google'a yazacagi INGILIZCE arama cumlesi
- Bu terim SPESIFIK olmali: "zod coerce number" gibi, "zod kullanimi" gibi DEGIL
- Amac: 10-15dk takilsin (uretken zorluk), 30dk+ takilmasin (ogrenilmis caresizlik)

### 3. Retrieval Practice (Aktif Geri Cagirma — Roediger & Karpicke)
- Her gorev sonunda "Kendine Sor" bolumu: 3-4 soru, KODU KAPATIP cevaplanacak
- Her phase sonunda "RETRIEVAL PRACTICE" bolumu: 10 soru, hedef 7/10
- Sorular "ne" degil "neden" ve "nasil" odakli olmali

### 4. Spaced Review (Aralikli Tekrar — Cepeda)
- Her phase basinda "ISINAN" bolumu: onceki phase'den 3-4 soru
- Cevaplayamazsa onceki phase'e donmeli
- Bu ATLANAMAZ — spaced review olmadan uzun sureli hafiza olusmuyor

### 5. Self-Explanation (Kendine Aciklama — Chi, Bisra)
- "Kendine Sor" sorulari "bu satir ne yapiyor" degil "NEDEN boyle yapiyoruz" formatinda
- Ornek: "safeParse neden parse yerine tercih edildi?" (tek dogru cevap yok, dusundurur)

### 6. Error-Driven Learning (Hatadan Ogrenme — Metcalfe)
- Her gorev sonunda "Sik Yapilan Hatalar" bolumu: 2-4 yaygin hata
- Her hata icin: ne olur + neden olur + nasil fark edilir
- Kullanici hatayi ONCE kendisi yapsin, sonra bu bolumu okusun

### 7. Progressive Scaffolding (Kademeli Destek Azaltma — Renkl)
- Ilk phase'lerde adimlar DAHA DETAYLI (ornek kodlar, import satirlari)
- Son phase'lerde adimlar DAHA AZ DETAYLI (sadece ne yapilacagi)
- Bu bilinclice yapilsin: Phase 1-2 = el tutma, Phase 5-7 = serbest birakma

## KURALLAR

### PRD Basi (her PRD'nin basinda olmali)

1. **Baslik + Tech Stack**
2. **"Bu Sistem Neden Ise Yarar?" bolumu** — 8 bilimsel prensibi KISA acikla (her biri 2-3 satir, kaynak belirt):
   - Micro-Task Decomposition (Sweller, Bilissel Yuk Teorisi)
   - Productive Struggle / Uretken Zorluk (Kapur 2016)
   - Retrieval Practice / Aktif Geri Cagirma (Roediger & Karpicke 2006)
   - Spaced Review / Aralikli Tekrar (Cepeda 2006)
   - Self-Explanation / Kendine Aciklama (Chi 1994, Bisra 2018)
   - Desirable Difficulties / Istenilen Zorluklar (Bjork & Bjork 2011)
   - Error-Driven Learning / Hatadan Ogrenme (Metcalfe 2017)
   - Implementation Intentions (Gollwitzer & Sheeran 2006)

3. **"ALTIN KURALLAR" bolumu** — 7 kural:
   ```
   KURAL 1: Adimi oku → ONCE KENDIN DENE (minimum 10 dakika)
   KURAL 2: Takilirsan → Verilen "Arama Terimi"ni Google'a yaz
   KURAL 3: Hala takilirsan → Resmi docs'a bak (MDN, paket docs)
   KURAL 4: 30dk+ gecti, hicbir ilerleme yok → Solutions dosyasina bak
   KURAL 5: Cozdukten sonra → "Kendine Sor" sorularini KODU KAPATIP cevapla
   KURAL 6: Ertesi gun → Onceki phase'in retrieval sorularini tekrar cevapla
   KURAL 7: Her gorev sonunda git commit at
   ```
   Zorluk kalibrasyonu:
   - 10-15dk takilmak = NORMAL (productive struggle)
   - 30dk+ = arama terimine gec
   - 5dk'dan kisa = cok kolay

   Solutions'a bakma kurali:
   - Arama terimini Google'ladin, 2-3 kaynak okudun, hala yapamiyorsun → BAK
   - Baktiktan sonra: kapat, 5dk bekle, HAFIZADAN tekrar yaz
   - "Bakip gecmek" ogrenme DEGILDIR

4. **Proje aciklamasi** — ne yapilacak, core entities, ogrenciyi one cikaran muhendislik pratikleri
5. **Zaman plani** — phase'ler ve sureler tablosu

### Her Gorev Formati (BIREBIR bu yapida olmali)

```
### Gorev X.Y — [Isim]

**Hedef:** [1 cumle — ne yapilacak]
**Gercek Dunya:** [1-2 cumle — neden onemli, production'da nasil kullanilir]
**Tahmini Sure:** [X-Y dakika]

#### Adim 1: [Spesifik aksiyon — ornek: "Dosya olustur"]
- [1-2 satir detay]
- Arama Terimi: "[Google'a yazilacak INGILIZCE terim]"
- Kontrol: [Bu adimin dogru yapildigini nasil anlarsin]

#### Adim 2: [Spesifik aksiyon]
- [Detay]
- Arama Terimi: "[terim]"
- Kontrol: [dogrulama]

... (her gorev 4-12 adim arasi)

**Sik Yapilan Hatalar:**
- [Hata 1]: [ne olur + neden]
- [Hata 2]: [ne olur + neden]

**Kendine Sor (kodu kapat, kafandan cevapla):**
1. [Neden/nasil sorusu]
2. [Neden/nasil sorusu]
3. [Neden/nasil sorusu]
```

### Adim Yazma Kurallari
- Her adim TEK BIR aksiyon icersin (dosya olustur VEYA fonksiyon yaz, ikisi birden DEGIL)
- Arama terimi INGILIZCE ve SPESIFIK olsun ("express error middleware 4 parameters" gibi)
- Arama terimi GENEL olmasin ("express middleware" gibi — cok genis)
- Kontrol somut olsun ("dosya var", "npx tsc --noEmit hatasiz", "terminal output gorunur")
- Ilk phase'lerde import satirlarini bile adim olarak ver
- Son phase'lerde sadece fonksiyon adini ver, import'u kullanici bulsun

### Phase Yapisi (her phase icin)

**Phase basinda:**
```
## ISINAN: Onceki Phase Tekrari (5 dakika)
Kodu ACMADAN cevapla:
1. [Onceki phase'den soru]
2. [Onceki phase'den soru]
3. [Onceki phase'den soru]
Cevaplayamadiysan onceki phase'e don.
```
(Phase 1 haric — onceki phase yok)

**Phase sonunda:**
```
## RETRIEVAL PRACTICE: Phase X (Ertesi Gun Cevapla)
Asagidaki sorulari KODU ACMADAN, kagida veya not dosyasina yaz.
```
- 8-10 soru
- "Neden" ve "nasil" odakli (ne degil)
- Hedef: 10 uzerinden en az 7
- 7'nin altinda → o phase'i tekrar gozden gecir

**Phase sonunda:**
```
## MULAKAT REHBERI: Phase X
```
- 4-5 gercekci mulakat sorusu
- Her soruya 2-3 cumlelik profesyonel cevap (mulakatci karsisinda soylenir gibi)
- "Projenle Kanitla" kismi: mulakatciya gosterecegi somut ornek cumleler
- Her cevap projeden SOMUT referans icersin ("projemde su sekilde implement ettim...")

**Her phase sonunda:**
```bash
git add .
git commit -m "feat/fix/test/docs: [conventional commit mesaji]"
```

### Phase Ilerleme Zorlugu (Progressive Difficulty)

Gorevlerin zorlugu phase'e gore artmali:

**Phase 1-2 (Junior — El Tutma):**
- Adimlar COK DETAYLI (import satirlari, dosya adlari, parametre tipleri)
- Her adimda arama terimi VAR
- Sik hatalar bolumu GENIS
- Ornek: "bcryptjs'den hash ve compare import et" (ne import edilecegi soyleniyor)

**Phase 3-4 (Mid-level — Yarim Destek):**
- Adimlar ORTA DETAYDA (fonksiyon adi ve amaci verilir, implementasyon kullanicida)
- Arama terimleri AZALIR (her adimda degil, zor adimlarda)
- Ornek: "Task service'de status gecislerini kontrol et" (nasil yapilacagi soylenmez)

**Phase 5-7 (Senior Mentalite — Serbest):**
- Adimlar YUKSEK SEVIYE (ne yapilacak verilir, nasil tamamen kullanicida)
- Arama terimleri SADECE yeni konseptlerde
- Ornek: "CI pipeline olustur: lint, typecheck, test, build adimlari" (detay yok)

### Icerik Kalitesi
- Gereksiz tekrar YAPMA. Ayni seyi farkli kelimelerle aciklama
- Motivasyon cumlesi KOYMA ("Harika gidiyorsun!" gibi). Sadece teknik icerik
- Her gorev bagimli oldugu gorevi ACIKCA belirtsin gerektiginde
- Toplam gorev sayisi 35-55 arasi olsun
- Sabitleri, tablolari, endpoint listelerini, DB sutunlarini ACIKCA yaz
- Her endpoint icin: HTTP method, path, kimin erisebilecegi, ne dondurdugu

### Zorunlu Gorevler (her projede olmali)

Su gorevler her projede FARKLI domain ile ama AYNI kalitede olmali:

**Foundation phase'de:**
- Environment validation (Zod)
- Custom error class (static factory methods)
- Global error handler middleware
- Validation middleware
- Request ID middleware
- Structured logger (Pino)
- Database connection (pool)
- Docker Compose (DB + Redis + API + healthcheck)
- Express app + server (AYRI dosyalar — neden: test)
- ESLint + Prettier

**Auth phase'de:**
- Password hashing (bcrypt)
- JWT utility (access + refresh, FARKLI secret)
- Auth flow: register, login, refresh (ROTATION + REUSE DETECTION), logout
- Repository → Service → Controller → Route katmanlari
- Authenticate middleware (Bearer token)
- Rate limiting
- HTTP-only cookie (refresh token)

**Core domain phase'de:**
- En az 3 entity arasi iliski (1-N, N-N)
- RBAC (en az 2 seviye: platform + resource bazli)
- State machine pattern (status gecisleri)
- Pagination utility
- Slug utility (URL-friendly)
- Validation schemas (her endpoint icin)

**Advanced phase'de:**
- Redis cache (cache-aside pattern + invalidation)
- Background job queue (BullMQ)
- File upload (opsiyonel ama tercih edilen)

**Testing phase'de:**
- Test altyapisi (Vitest + supertest)
- Factory fonksiyonlar
- Auth testleri (basarili + basarisiz senaryolar)
- CRUD testleri
- RBAC testleri
- %80+ coverage

**DevOps phase'de:**
- Swagger/OpenAPI docs
- Production Dockerfile (multi-stage)
- CI pipeline (GitHub Actions)
- Deploy (canli URL)

**Polish phase'de:**
- Professional README
- Guvenlik kontrolu
- Boilerplate extraction (altyapi vs domain ayirimi)
- Portfolio sunumu

### Son Bolumler (her PRD'nin sonunda olmali)

1. **FINAL RETRIEVAL PRACTICE** — Tum projeden 20-25 soru, hedef 20/25+
2. **MULAKAT REHBERI: Genel** — "Kendinizden bahsedin", "en zorlandigin problem", "kod kalitesi", "olceklendirme"
3. **PROJE BITTIKTEN SONRA** — elinde ne olacak, mulakatta ne soyleyeceksin, sonraki adimlar
4. **Boilerplate listesi** — hangi dosyalar her projeye tasınır, hangileri domain-spesifik

### AYRI DOSYA: Cevap Anahtari

`{ProjeAdi}-Solutions.md` dosyasi da olustur:
- Her gorev icin best practice TypeScript kodu
- Kodun altinda "Neden boyle" aciklamasi (1-2 cumle, uzatma)
- Yaygin hatalardan kacis notu
- Her cozumde kullanilan PATTERN adini belirt (Factory, Repository, Cache-Aside vs.)

### YASAKLAR
- Gorev icinde tam kod blogu VERME (cevap anahtarinda olacak)
- "vs.", "vb.", "gerekli seyleri ekle" gibi belirsiz ifadeler YASAK
- 1 gorevde 2 farkli konuyu birlestirme (her gorev TEK sorumluluk)
- Scope creep yapma — sadece belirtilen tech stack'i kullan
- Turkce karakter kullanma (dosya adi ve kodda) — aciklamalarda Turkce, teknik terimlerde Ingilizce
- Arama terimlerini TURKCE yazma — her zaman INGILIZCE (kaynaklar Ingilizce)
- "Guzel yap", "duzgun implement et" gibi olculemez ifadeler YASAK
- Adim icinde birden fazla is BIRDEN yapmak YASAK (1 adim = 1 aksiyon)
```

---

## Ornek Kullanim

Yeni proje baslatirken bu prompt'u kullan ve sonuna proje bilgisini ekle:

```
{yukaridaki prompt}

Simdi su proje icin PRD + Solutions dosyasi olustur:
- Proje: JobHunt API — Is ilanlari ve basvuru takip sistemi
- Tech stack: Node.js + Express + TypeScript + PostgreSQL + Drizzle ORM + Redis
- Sure: 8 hafta
- Entities: Users, Companies, Jobs, Applications, SavedJobs
- Core features: Sirket profili, ilan CRUD, basvuru durumu takibi, kayitli ilanlar
```
---

## Proje Fikirleri (her biri farkli domain, AYNI altyapi)

Boilerplate'ini cikardiktan sonra su projelerden birini sec:

### Proje 2: EventPulse API
- Etkinlik yonetim sistemi (meetup.com benzeri)
- Entities: Users, Events, Tickets, Reviews, Categories
- Ozel: QR kod bilet, kapasite kontrolu, waitlist, etkinlik durumu state machine

### Proje 3: FinTrack API
- Kisisel finans takip sistemi
- Entities: Users, Accounts, Transactions, Budgets, Categories
- Ozel: Recurring transaction'lar, butce asim uyarisi, aylik rapor, CSV import

### Proje 4: DevBlog API
- Gelistirici blog platformu (dev.to benzeri)
- Entities: Users, Posts, Tags, Comments, Bookmarks, Series
- Ozel: Markdown rendering, tag bazli arama, seri yazilar, draft/published state machine

### Proje 5: HealthLog API
- Saglik ve fitness takip sistemi
- Entities: Users, Workouts, Exercises, Meals, Goals, Progress
- Ozel: Egzersiz sablonlari, kalori hesaplama, haftalik ilerleme raporu, streak sistemi

Her projede:
- AYNI altyapi (boilerplate'ten gelir)
- FARKLI domain mantigi (state machine kurallari, RBAC rolleri, is kurallari)
- 3 proje bittiginde portfolyonde 3 farkli domain + tutarli muhendislik kalitesi

