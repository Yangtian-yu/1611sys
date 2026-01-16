import { Controller, Get, Put, Body, UseGuards } from "@nestjs/common";
import { DutyService } from "./duty.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../user/guards/roles.guard";
import { Roles } from "../user/decorators/roles.decorator";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Controller("duty")
@UseGuards(JwtAuthGuard)
export class DutyController {
  constructor(private readonly dutyService: DutyService) {}

  @Get("current")
  getCurrentWeekDuty() {
    return this.dutyService.getCurrentWeekDuty();
  }

  @Put("current")
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  updateCurrentWeekDuty(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.dutyService.updateCurrentWeekDuty(updateScheduleDto);
  }
}
