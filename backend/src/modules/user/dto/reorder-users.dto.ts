import { IsArray, IsString } from "class-validator";

export class ReorderUsersDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
