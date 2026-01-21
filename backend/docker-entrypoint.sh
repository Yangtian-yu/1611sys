#!/bin/sh
set -e

echo "🚀 启动后端服务..."

# 等待数据库完全准备好
echo "⏳ 等待数据库就绪..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ 数据库已就绪"

# 执行数据库迁移
echo "📦 执行数据库迁移..."
pnpm prisma:deploy

# 如果设置了 DB_SEED=true，则执行种子数据
if [ "$DB_SEED" = "true" ]; then
  echo "🌱 执行数据库种子数据..."
  pnpm prisma:seed || echo "⚠️  种子数据执行失败或已存在，跳过..."
fi

# 启动应用
echo "✨ 启动应用程序..."
exec node dist/src/main.js
