import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  @IsString()
  username: string;

  @IsNotEmpty({ message: "密码不能为空" })
  @IsString()
  @MinLength(6, { message: "密码至少6位" })
  password: string;

  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;
}
