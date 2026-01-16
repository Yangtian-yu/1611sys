import { Injectable } from "@nestjs/common";
const ww = require("chinese-workday");

@Injectable()
export class HolidayService {
  /**
   * 判断是否为工作日（包含调休补班）
   */
  isWorkday(date: Date): boolean {
    return ww.isWorkday(date);
  }

  /**
   * 判断是否为法定节假日
   */
  isHoliday(date: Date): boolean {
    return ww.isHoliday(date);
  }

  /**
   * 获取某天所在周的最后一个工作日
   * 通常从周五开始往前找，如果在周六或周日有调休补班，也会考虑
   */
  getLastWorkdayOfWeek(date: Date): Date {
    // 找到该周的周日
    const day = date.getDay();
    const diffToSunday = 7 - day;
    const sunday = new Date(date);
    sunday.setDate(date.getDate() + (day === 0 ? 0 : diffToSunday));
    sunday.setHours(0, 0, 0, 0);

    // 从周日开始往前找，第一个工作日即为该周最后一个工作日
    const current = new Date(sunday);
    for (let i = 0; i < 7; i++) {
      if (this.isWorkday(current)) {
        return new Date(current);
      }
      current.setDate(current.getDate() - 1);
    }

    return date; // 兜底返回传入日期
  }
}
