#!/bin/bash
# Sunucuda 500 hatalarını düzelten script
# Kullanım: bash fix-production.sh

echo "=== ITU Ginova Production Fix ==="
echo ""

# 1. pg paketini yükle
echo "📦 pg paketi yükleniyor..."
npm install pg

if [ $? -ne 0 ]; then
    echo "❌ Hata: npm install başarısız"
    exit 1
fi

echo "✅ pg paketi yüklendi"
echo ""

# 2. server/db.ts dosyasını güncelle
echo "📝 server/db.ts güncelleniyor..."

cat > server/db.ts << 'EOF'
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
EOF

echo "✅ server/db.ts güncellendi"
echo ""

# 3. PM2'yi yeniden başlat
echo "🔄 PM2 yeniden başlatılıyor..."
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save

echo ""
echo "✅ Tamamlandı!"
echo ""
echo "📊 Logları kontrol et:"
echo "   pm2 logs ginova-app --lines 50"
echo ""
echo "🌐 Web siteni test et:"
echo "   http://ginova.itu.edu.tr"
echo ""
