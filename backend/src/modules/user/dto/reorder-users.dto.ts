import { IsArray, IsNumber } from "class-validator";

export class ReorderUsersDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
