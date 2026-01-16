import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>("MAIL_USER");
    const pass = this.configService.get<string>("MAIL_PASS");

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: "qq", // 默认 QQ 邮箱，也可通过 host 扩展
        auth: { user, pass },
      });
      this.logger.log("邮件服务初始化成功。");
    } else {
      this.logger.warn(
        "未配置邮件参数 (MAIL_USER/MAIL_PASS)，邮件将仅在日志中模拟发送。"
      );
    }
  }

  async sendMail(to: string[], subject: string, content: string) {
    if (!this.transporter) {
      this.logger.log(
        `[模拟发送邮件] TO: ${to.join(
          ","
        )}, SUBJECT: ${subject}, CONTENT: ${content.substring(0, 50)}...`
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>("MAIL_USER"),
        to: to.join(","),
        subject,
        html: content.replace(/\n/g, "<br>"),
      });
      this.logger.log(`邮件发送完成: ${to.length} 位接收者。`);
    } catch (error) {
      this.logger.error("邮件发送失败:", error);
    }
  }
}
