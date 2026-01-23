import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 数据库健康检查
      () => this.prismaHealth.pingCheck("database", this.prisma),

      // 磁盘空间检查（可用空间 > 80%）
      () =>
        this.disk.checkStorage("storage", {
          path: "/",
          thresholdPercent: 0.8,
        }),

      // 内存检查（堆内存 < 300MB）
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),

      // RSS 内存检查（< 300MB）
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
    ]);
  }
}
