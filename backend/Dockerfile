# 构建阶段
FROM node:20-slim AS builder

# 配置 Debian 国内镜像源
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# 配置 npm 国内镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

# 安装构建工具 (用于编译原生模块如 bcrypt)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 复制 package.json 和 lock 文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm (固定版本)
RUN npm install -g pnpm@10 && \
    pnpm config set registry https://registry.npmmirror.com

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

# 配置 Debian 国内镜像源
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# 配置 npm 国内镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

# 安装运行时依赖 (bcrypt、Prisma、netcat 需要)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# 安装 pnpm
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

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
