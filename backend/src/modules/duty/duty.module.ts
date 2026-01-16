import { Module } from "@nestjs/common";
import { DutyService } from "./duty.service";
import { DutyController } from "./duty.controller";
import { HolidayService } from "./holiday.service";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [DutyController],
  providers: [DutyService, HolidayService, NotificationService],
  exports: [DutyService, HolidayService],
})
export class DutyModule {}
