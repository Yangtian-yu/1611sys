@echo off
echo 🚀 启动 1611值日系统...
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未运行，请先启动 Docker
    pause
    exit /b 1
)

REM 构建并启动所有服务
echo 📦 构建 Docker 镜像...
docker-compose build

echo 🔄 启动服务...
docker-compose up -d

echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 📊 服务状态：
docker-compose ps

echo.
echo ✅ 启动完成！
echo.
echo 📍 访问地址：
echo    前端: http://localhost
echo    后端 API: http://localhost:3000/api
echo    数据库: localhost:5432
echo.
echo 🔑 测试账号：
echo    管理员: admin / Admin@1611
echo    员工: 李明 / 123456
echo.
echo 📝 查看日志: docker-compose logs -f
echo 🛑 停止服务: docker-compose down
echo.
pause
