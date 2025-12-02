# Prod

uksiyon Sunucusunda 500 Hatalarını Düzeltme

## Sorun
Uygulama yerel PostgreSQL veritabanı yerine Neon WebSocket bağlantısı kullanmaya çalışıyor. Bu da `wss://localhost/v2` bağlantı hatasına ve 500 API hatalarına neden oluyor.

## Çözüm
Veritabanı bağlantı kodunu güncelledim. Şimdi otomatik olarak:
- **Neon veritabanı** kullanıyorsa → WebSocket bağlantısı kullanır
- **Yerel PostgreSQL** kullanıyorsa → Standart pg driver kullanır

## Sunucuda Yapılacaklar

### 1. Güncellenmiş kodu çek
```bash
cd /home/ginovai/public_html
git pull origin main
```

### 2. pg paketini yükle (eksikse)
```bash
npm install pg
```

### 3. PM2'yi yeniden başlat
```bash
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save
```

### 4. Logları kontrol et
```bash
pm2 logs ginova-app --lines 50
```

**Artık şu hataları GÖRMEMELİSİN:**
- ✅ `Error [ECONNREFUSED]: wss://localhost/v2` - GİDECEK
- ✅ `500 Failed to fetch programs/mentors/events/blog` - GİDECEK

**Göreceğin normal loglar:**
- ✅ `serving on port 5000`
- ✅ `GET /api/programs 200` (500 değil!)

## Alternatif: Manuel Dosya Değişikliği

Eğer git pull çalışmazsa, `server/db.ts` dosyasını manuel güncelle:

```bash
nano /home/ginovai/public_html/server/db.ts
```

İçeriği şununla değiştir:

```typescript
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Check if we're using Neon (WebSocket-based) or local PostgreSQL
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech');

export const pool = isNeonDatabase 
  ? new NeonPool({ connectionString: process.env.DATABASE_URL })
  : new PgPool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: false
    });

export const db = isNeonDatabase
  ? drizzleNeon({ client: pool as NeonPool, schema })
  : drizzlePg({ client: pool as PgPool, schema });

// Set up WebSocket for Neon only
if (isNeonDatabase) {
  neonConfig.webSocketConstructor = ws;
}
```

Kaydet (Ctrl+O, Enter, Ctrl+X) ve PM2'yi yeniden başlat.

## Test Et

Web siteni aç: **http://ginova.itu.edu.tr** veya **http://185.171.24.91:5000**

- Ana sayfa programları, mentorları, blog yazılarını göstermeli
- Admin paneli: http://ginova.itu.edu.tr/admin
  - Email: `admin@ginova.itu.edu.tr`
  - Şifre: `admin123`

## Özet

✅ **Yapılan:** Database driver'ı Neon WebSocket'ten standart PostgreSQL'e çevirdim  
✅ **Sonuç:** Artık yerel PostgreSQL ile sorunsuz çalışacak  
✅ **Süre:** ~2 dakika deployment
