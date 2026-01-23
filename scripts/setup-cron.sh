#!/bin/bash

# 配置数据库自动备份定时任务
# 每天凌晨 2:00 自动备份

set -e

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

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-db.sh"

log_info "项目目录: $PROJECT_DIR"
log_info "备份脚本: $BACKUP_SCRIPT"

# 检查备份脚本是否存在
if [ ! -f "$BACKUP_SCRIPT" ]; then
    log_error "备份脚本不存在: $BACKUP_SCRIPT"
    exit 1
fi

# 给脚本添加执行权限
chmod +x "$BACKUP_SCRIPT"
chmod +x "$SCRIPT_DIR/restore-db.sh"

# 创建 cron 任务
CRON_CMD="0 2 * * * cd $PROJECT_DIR && $BACKUP_SCRIPT >> $PROJECT_DIR/logs/backup.log 2>&1"

log_info "准备添加定时任务..."
echo "定时任务内容:"
echo "  $CRON_CMD"
echo ""

# 检查是否已存在相同的 cron 任务
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    log_warn "定时任务已存在，跳过添加"
    log_info "当前的定时任务:"
    crontab -l | grep "$BACKUP_SCRIPT"
else
    # 添加到 crontab
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    log_info "定时任务添加成功！"
    log_info "备份将在每天凌晨 2:00 自动执行"
fi

# 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

log_info "配置完成！"
echo ""
echo "其他有用的命令:"
echo "  查看定时任务: crontab -l"
echo "  删除定时任务: crontab -e (手动删除对应行)"
echo "  手动执行备份: cd $PROJECT_DIR && ./scripts/backup-db.sh"
echo "  查看备份日志: tail -f $PROJECT_DIR/logs/backup.log"
