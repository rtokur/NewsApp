import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { StringifyOptions } from 'querystring';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly appName: string;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    this.appName = this.configService.get('APP_NAME') || 'NewsApp';
    this.fromEmail =
      this.configService.get('SMTP_FROM') ||
      `no-reply@${this.appName.toLowerCase()}.com`;

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_PORT') === 465,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server is ready to take messages');
    } catch (error) {
      console.error('Error connecting to email server:', error);
    }
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
    options?: {
      cc?: string;
      bcc?: string;
      attachments?: any[];
    },
  ) {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"${this.appName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Mail send failed:', error);
      throw new InternalServerErrorException('Email could not be sent');
    }
  }

  private getEmailTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            margin-bottom: 15px;
            color: #4B5563;
            font-size: 15px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .info-box {
            background-color: #F3F4F6;
            border-left: 4px solid #2563EB;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning-box {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .success-box {
            background-color: #D1FAE5;
            border-left: 4px solid #10B981;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .danger-box {
            background-color: #FEE2E2;
            border-left: 4px solid #DC2626;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            margin: 5px 0;
            color: #6B7280;
            font-size: 13px;
          }
          .link {
            color: #2563EB;
            word-break: break-all;
          }
          strong {
            color: #1F2937;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            ${content}
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  }

  async sendPasswordResetEmail(
    to: string,
    fullName: string,
    resetLink: string,
  ) {
    const content = `
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>

        <div class="info-box">
          <p style="margin: 0;"><strong>⏱ Link expires in 6 hours</strong></p>
        </div>

        <p>Or copy and paste this link into your browser:</p>
        <p class="link">${resetLink}</p>

        <div class="warning-box">
          <p style="margin: 0;"><strong>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</strong></p>
          </div>

          <p>Best regards,<br><strong>The${this.appName} Team</strong></p>
      </div>
    `;

    await this.sendMail(
      to,
      `${this.appName} - Password Reset Request`,
      this.getEmailTemplate(content),
    );
  }

  async sendPasswordChangedEmail(to: string, fullName: string) {
    const content = `
      <div class="header">
        <h1>Password Changed Successfully</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>

        <div class="success-box">
          <p style="margin: 0;">Your password has been changed successfully.</p>
        </div>

        <p>If you made this change, you can safely ignore this email.</p>
        <div class="danger-box">
          <p style="margin-bottom: 10px;"><strong>Didn't change your password?</strong></p>
          <p style="margin: 0;">If you did not change your password, please secure your account immediately by resetting your password or contacting our support team.</p>
                  </div>

        <p>Best regards,<br><strong>The ${this.appName} Team</strong></p>
        
      </div>
    `;

    await this.sendMail(
      to,
      `${this.appName} - Password Changed Successfully`,
      this.getEmailTemplate(content),
    );
  }

  async sendEmailChangeVerification(
    to: string,
    fullName: string,
    verificationLink: string,
  ) {
    const content = `
      <div class="header">
        <h1>Verify Your New Email</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>

        <p>You recently requested to change your email address to this one.</p>
        <p>Click the button below to verify and complete this change:</p>
        <div style="text-align: center;">
          <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>

        <div class="info-box">
          <p style="margin: 0;"><strong>⏱ Link expires in 24 hours</strong></p>
        </div>

        <p>Or copy and paste this link into your browser:</p>
        <p class="link">${verificationLink}</p>

        <div class="warning-box">
          <p style="margin: 0;"><strong>If you did not request this change, please ignore this email. Your email address will remain unchanged.</strong></p>
        </div>

        <p>Best regards,<br><strong>The ${this.appName} Team</strong></p>
      </div>
    `;

    await this.sendMail(
      to,
      `${this.appName} - Verify Your New Email Address`,
      this.getEmailTemplate(content),
    );
  }

  async sendEmailChangedNotification(
    to: string, 
    fullName: string, 
    oldEmail: string,
    newEmail: string,
  ) {
    const content = `
      <div class="header">
        <h1>⚠️ Email Change Request</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>
        
        <div class="warning-box">
          <p style="margin-bottom: 10px;"><strong>🔔 Security Alert</strong></p>
          <p style="margin: 0;">We received a request to change your email address.</p>
        </div>
        
        <div class="info-box">
          <p style="margin-bottom: 5px;"><strong>Current Email:</strong> ${oldEmail}</p>
          <p style="margin: 0;"><strong>New Email:</strong> ${newEmail}</p>
        </div>
        
        <p><strong>If this was you:</strong></p>
        <p>No action is needed. The change will be completed once the new email address is verified.</p>
        
        <div class="danger-box">
          <p style="margin-bottom: 10px;"><strong>⚠️ If you didn't request this:</strong></p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Your account may be compromised</li>
            <li>Change your password immediately</li>
            <li>Contact our support team</li>
          </ul>
        </div>
        
        <p>Best regards,<br><strong>${this.appName} Team</strong></p>
      </div>
    `;
    await this.sendMail(
      to,
      `${this.appName} - Email Change Request`,
      this.getEmailTemplate(content),
    );
  }

  async sendEmailChangeSuccess(
    to: string,
    fullName: string,
    newEmail: string,
  ) {
    const content = `
      <div class="header">
        <h1>Email Successfully Changed</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>
        
        <div class="success-box">
          <p style="margin-bottom: 5px;"><strong>Success!</strong></p>
          <p style="margin: 0;">Your email address has been successfully updated to <strong>${newEmail}</strong>.</p>
        </div>
        
        <p>You can now use this email address to sign in to your account.</p>
        
        <div class="info-box">
          <p style="margin: 0;"><strong>🔒 Security Note:</strong> For security reasons, you've been logged out of all devices. Please log in again with your new email address.</p>
        </div>
        
        <p>Best regards,<br><strong>${this.appName} Team</strong></p>
      </div>
    `;
  
    await this.sendMail(
      to,
      `${this.appName} - Email Successfully Changed`,
      this.getEmailTemplate(content),
    );
  }

  async sendEmailChangeComplete(
    to: string,
    fullName: string,
    oldEmail: string,
    newEmail: string,
  ) {
    const supportEmail = this.configService.get('SUPPORT_EMAIL') || 'support@newsapp.com';

    const content = `
      <div class="header">
        <h1>Email Change Changed</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${fullName}</strong>,</p>
        
        <div class="info-box">
          <p style="margin-bottom: 5px;"><strong>Account Update</strong></p>
          <p style="margin: 0;">Your email address has been successfully changed.</p>
        </div>
        
        <p><strong>Previous Email:</strong> ${oldEmail}</p>
        <p><strong>New Email:</strong> ${newEmail}</p>
        
        <p>This email is being sent to your old address for your records.</p>
        
        <div class="danger-box">
          <p style="margin-bottom: 10px;"><strong>⚠️ If you didn't make this change:</strong></p>
          <p style="margin: 0;">Your account security may be at risk. Please contact our support team immediately at <a href="mailto:${supportEmail}" style="color: #DC2626;">${supportEmail}</a></p>
        </div>
        
        <p>Best regards,<br><strong>${this.appName} Team</strong></p>
      </div>
    `;

    await this.sendMail(
      to,
      `${this.appName} - Your Email Address Has Been Changed`,
      this.getEmailTemplate(content),
    );
  }
}
