import { Module } from "@nestjs/common";
import { DutyService } from "./duty.service";
import { DutyController } from "./duty.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [DutyController],
  providers: [DutyService],
})
export class DutyModule {}
