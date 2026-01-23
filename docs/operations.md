# 运维指南

本文档汇总了系统运维相关的所有功能和最佳实践。

---

## 📚 文档索引

| 文档 | 说明 |
|------|------|
| [数据库备份恢复](./database-backup.md) | 数据库自动备份和恢复操作 |
| [CI/CD 配置](./ci-cd-setup.md) | 自动化构建和部署配置 |
| [部署日志](./部署日志-2026-01-22.md) | 详细的部署记录和问题解决 |

---

## 🎯 快速操作

### 数据库备份

```bash
# 手动备份
cd ~/1611sys
./scripts/backup-db.sh

# 查看备份
ls -lh backups/

# 恢复备份
./scripts/restore-db.sh backups/backup_duty_system_20260123_120000.sql.gz
```

### 健康检查

```bash
# 检查服务状态
curl http://localhost:3000/api/health

# 或在生产环境
curl http://47.95.43.38/api/health
```

返回示例：
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  }
}
```

### 自动部署

```bash
# 1. 提交代码
git add .
git commit -m "feat: 新功能"
git push

# 2. 创建版本并部署
git tag v1.0.1
git push origin v1.0.1

# 3. GitHub Actions 自动部署
```

---

## 📊 监控要点

### 日常检查（每天）

- [ ] 服务健康状态：`curl http://47.95.43.38/api/health`
- [ ] 数据库备份：`ls -lt ~/1611sys/backups/ | head -2`
- [ ] 磁盘空间：`df -h`
- [ ] Docker 容器状态：`docker compose ps`

### 每周检查

- [ ] 查看备份日志：`tail -50 ~/1611sys/logs/backup.log`
- [ ] 清理 Docker：`docker system prune -f`
- [ ] 检查系统日志：`journalctl -u docker --since "1 week ago"`

### 每月检查

- [ ] 测试数据库恢复流程
- [ ] 更新系统包：`apt update && apt upgrade`
- [ ] 检查 SSL 证书有效期（如果使用 HTTPS）
- [ ] 审查访问日志

---

## 🚨 故障处理

### 服务无法访问

```bash
# 1. 检查容器状态
docker compose ps

# 2. 查看日志
docker compose logs backend
docker compose logs frontend

# 3. 重启服务
docker compose restart

# 4. 如果仍有问题，完全重建
docker compose down
docker compose up -d
```

### 数据库问题

```bash
# 检查数据库连接
docker exec -it duty-system-db psql -U postgres -d duty_system -c "SELECT COUNT(*) FROM users;"

# 查看数据库日志
docker compose logs postgres

# 恢复到最近备份
./scripts/restore-db.sh backups/backup_duty_system_latest.sql.gz
```

### 磁盘空间不足

```bash
# 查看磁盘使用
df -h

# 清理 Docker
docker system prune -a -f

# 清理旧备份（保留最近 7 个）
cd ~/1611sys/backups
ls -t | tail -n +8 | xargs rm -f

# 清理日志
truncate -s 0 ~/1611sys/logs/*.log
```

---

## 🔐 安全检查

### 定期更新

```bash
# 更新系统包
apt update && apt upgrade -y

# 更新 Docker 镜像
cd ~/1611sys
docker compose pull
docker compose up -d
```

### 检查配置

```bash
# 确保敏感信息不在 Git 中
cd ~/1611sys
git status
cat .gitignore

# 检查环境变量
cat .env | grep -v "^#" | grep -v "^$"
```

### 访问控制

```bash
# 查看当前登录用户
who

# 查看最近登录记录
last -10

# 检查防火墙规则
ufw status
```

---

## 📈 性能优化

### 数据库优化

```bash
# 分析数据库表
docker exec -it duty-system-db psql -U postgres -d duty_system -c "ANALYZE;"

# 查看慢查询（如果启用了日志）
docker exec -it duty-system-db psql -U postgres -d duty_system -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

### Docker 优化

```bash
# 查看容器资源使用
docker stats --no-stream

# 限制容器资源（如需要）
# 编辑 docker-compose.yml 添加：
# services:
#   backend:
#     deploy:
#       resources:
#         limits:
#           cpus: '1'
#           memory: 512M
```

---

## 📝 变更日志

记录所有重大变更：

| 日期 | 版本 | 变更内容 | 操作人 |
|------|------|----------|--------|
| 2026-01-23 | v1.0.0 | 初始部署 | - |
| 2026-01-23 | v1.0.1 | 添加数据库备份、健康检查、CI/CD | - |

---

## 🆘 紧急联系

如遇到无法解决的问题：

1. 查看相关文档
2. 检查 GitHub Issues
3. 查看系统日志
4. 考虑回滚到上一个稳定版本

**回滚步骤**：

```bash
cd ~/1611sys
git tag -l  # 查看可用版本
git checkout v1.0.0  # 切换到稳定版本
docker compose down
docker compose up -d
```
