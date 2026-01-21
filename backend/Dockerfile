# 构建阶段
FROM node:20-slim AS builder

WORKDIR /app

# 安装构建工具 (用于编译原生模块如 bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# 复制 package.json 和 lock 文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm (固定版本)
RUN npm install -g pnpm@10

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-slim

WORKDIR /app

# 安装运行时依赖 (bcrypt、Prisma、netcat 需要)
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# 安装 pnpm
RUN npm install -g pnpm

# 从构建阶段复制所有内容
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# 复制启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 暴露端口
EXPOSE 3000

# 使用 entrypoint 脚本启动
ENTRYPOINT ["docker-entrypoint.sh"]
