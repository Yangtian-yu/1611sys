# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装构建工具 (用于编译原生模块如 bcrypt)
RUN apk add --no-cache python3 make g++ openssl-dev

# 复制 package.json 和 lock 文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 安装运行时依赖 (bcrypt 和 Prisma 需要)
RUN apk add --no-cache python3 make g++ openssl-dev

# 安装 pnpm
RUN npm install -g pnpm

# 从构建阶段复制所有内容
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# 重新构建原生模块以确保兼容性
RUN cd node_modules/bcrypt && npm rebuild bcrypt --build-from-source

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/src/main.js"]
