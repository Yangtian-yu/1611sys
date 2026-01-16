import { IsNumber, Min, Max } from "class-validator";

export class UpdateScheduleDto {
  @IsNumber()
  @Min(2, { message: "值日人数至少2人" })
  @Max(4, { message: "值日人数最多4人" })
  dutyCount: number; // 值日人数：2/3/4
}
