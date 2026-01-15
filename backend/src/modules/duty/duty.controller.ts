import { Controller, Get, UseGuards } from "@nestjs/common";
import { DutyService } from "./duty.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("duty")
@UseGuards(JwtAuthGuard)
export class DutyController {
  constructor(private dutyService: DutyService) {}

  @Get("current")
  async getCurrentWeekDuty() {
    return this.dutyService.getCurrentWeekDuty();
  }
}
