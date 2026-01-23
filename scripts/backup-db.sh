#!/bin/bash

# 数据库备份脚本
# 自动备份 PostgreSQL 数据库并保留最近 7 天的备份

set -e

# ============ 配置 ============

# 备份目录
BACKUP_DIR="${BACKUP_DIR:-./backups}"
# Docker 容器名称
CONTAINER_NAME="${CONTAINER_NAME:-duty-system-db}"
# 数据库名称
DB_NAME="${DB_NAME:-duty_system}"
# 保留天数
KEEP_DAYS="${KEEP_DAYS:-7}"

# ============ 颜色输出 ============

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============ 函数定义 ============

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============ 主逻辑 ============

log_info "开始备份数据库..."

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 生成备份文件名（带时间戳）
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"
BACKUP_FILE_GZ="$BACKUP_FILE.gz"

# 检查容器是否运行
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    log_error "数据库容器 $CONTAINER_NAME 未运行"
    exit 1
fi

log_info "备份文件: $BACKUP_FILE_GZ"

# 执行备份
docker exec -t "$CONTAINER_NAME" pg_dump -U postgres -d "$DB_NAME" > "$BACKUP_FILE"

# 检查备份是否成功
if [ ! -s "$BACKUP_FILE" ]; then
    log_error "备份失败：文件为空"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# 压缩备份文件
log_info "压缩备份文件..."
gzip "$BACKUP_FILE"

# 获取备份文件大小
BACKUP_SIZE=$(du -h "$BACKUP_FILE_GZ" | cut -f1)
log_info "备份完成！文件大小: $BACKUP_SIZE"

# 清理旧备份（保留最近 N 天）
log_info "清理 $KEEP_DAYS 天前的旧备份..."
find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.sql.gz" -type f -mtime +$KEEP_DAYS -delete

# 列出当前所有备份
log_info "当前备份列表:"
ls -lh "$BACKUP_DIR"/backup_${DB_NAME}_*.sql.gz 2>/dev/null || log_warn "暂无备份文件"

log_info "备份任务完成！"
