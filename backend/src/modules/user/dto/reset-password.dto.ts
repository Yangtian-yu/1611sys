import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "新密码不能为空" })
  @IsString()
  @MinLength(6, { message: "密码至少6位" })
  newPassword: string;
}
