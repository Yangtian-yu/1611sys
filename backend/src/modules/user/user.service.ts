import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ReorderUsersDto } from "./dto/reorder-users.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        orderIndex: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: users,
    };
  }

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException("用户名已存在");
    }

    // 获取当前最大的 orderIndex
    const users = await this.prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      orderBy: { orderIndex: "desc" },
    });

    const maxOrderIndex = users.length > 0 ? users[0].orderIndex : 0;

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        email: createUserDto.email,
        role: "EMPLOYEE",
        orderIndex: maxOrderIndex + 1,
        isActive: true, // 默认开启
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        orderIndex: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: user,
      message: "员工创建成功",
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    // 如果更新用户名，检查是否重复
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException("用户名已存在");
      }
    }

    // 更新用户
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        orderIndex: true,
        isActive: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "员工信息更新成功",
    };
  }

  async remove(id: string) {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    // 不允许删除管理员
    if (user.role === "ADMIN") {
      throw new ConflictException("不能删除管理员账号");
    }

    // 删除用户
    await this.prisma.user.delete({ where: { id } });

    return {
      success: true,
      message: "员工删除成功",
    };
  }

  async reorder(reorderUsersDto: ReorderUsersDto) {
    const { userIds } = reorderUsersDto;

    // 批量更新用户顺序
    const updatePromises = userIds.map((userId, index) =>
      this.prisma.user.update({
        where: { id: userId },
        data: { orderIndex: index + 1 },
      })
    );

    await Promise.all(updatePromises);

    return {
      success: true,
      message: "员工顺序更新成功",
    };
  }

  async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // 更新密码
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "密码重置成功",
    };
  }
}
