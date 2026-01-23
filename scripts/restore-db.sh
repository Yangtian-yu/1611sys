#!/bin/bash

# 数据库恢复脚本
# 从备份文件恢复 PostgreSQL 数据库

set -e

# ============ 配置 ============

# 备份目录
BACKUP_DIR="${BACKUP_DIR:-./backups}"
# Docker 容器名称
CONTAINER_NAME="${CONTAINER_NAME:-duty-system-db}"
# 数据库名称
DB_NAME="${DB_NAME:-duty_system}"

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

# 检查参数
if [ $# -eq 0 ]; then
    log_error "请指定要恢复的备份文件"
    echo ""
    echo "用法: $0 <备份文件路径>"
    echo ""
    echo "示例:"
    echo "  $0 backups/backup_duty_system_20260123_120000.sql.gz"
    echo ""
    echo "可用的备份文件:"
    ls -1t "$BACKUP_DIR"/backup_${DB_NAME}_*.sql.gz 2>/dev/null | head -5 || echo "  暂无备份文件"
    exit 1
fi

BACKUP_FILE="$1"

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "备份文件不存在: $BACKUP_FILE"
    exit 1
fi

log_warn "========================================="
log_warn "警告：此操作将覆盖当前数据库！"
log_warn "数据库: $DB_NAME"
log_warn "备份文件: $BACKUP_FILE"
log_warn "========================================="
echo ""
read -p "确定要继续吗？(yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log_info "已取消恢复操作"
    exit 0
fi

# 检查容器是否运行
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    log_error "数据库容器 $CONTAINER_NAME 未运行"
    exit 1
fi

log_info "开始恢复数据库..."

# 解压备份文件（如果是压缩的）
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log_info "解压备份文件..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
else
    RESTORE_FILE="$BACKUP_FILE"
fi

# 删除现有数据库并重新创建
log_info "重新创建数据库..."
docker exec -t "$CONTAINER_NAME" psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec -t "$CONTAINER_NAME" psql -U postgres -c "CREATE DATABASE $DB_NAME;"

# 恢复数据
log_info "恢复数据..."
docker exec -i "$CONTAINER_NAME" psql -U postgres -d "$DB_NAME" < "$RESTORE_FILE"

# 清理临时文件
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm -f "$TEMP_FILE"
fi

log_info "数据库恢复完成！"
log_warn "请重启后端服务以应用更改："
echo "  docker compose restart backend"
