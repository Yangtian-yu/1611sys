import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: "邮箱格式不正确" })
  email?: string;

  @IsOptional()
  isActive?: boolean;
}
