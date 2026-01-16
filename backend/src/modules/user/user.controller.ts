import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ReorderUsersDto } from "./dto/reorder-users.dto";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Put("reorder/batch")
  reorder(@Body() reorderUsersDto: ReorderUsersDto) {
    return this.userService.reorder(reorderUsersDto);
  }

  @Post(":id/reset-password")
  resetPassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.userService.resetPassword(id, resetPasswordDto);
  }
}
