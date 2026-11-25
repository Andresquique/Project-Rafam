import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly mailFrom: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    this.resend = new Resend(apiKey);

    this.mailFrom =
      this.configService.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:4000';
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const { error } = await this.resend.emails.send({
      from: this.mailFrom,
      to: email,
      subject: 'Recuperación de contraseña - VitalMove',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Recuperación de contraseña</h2>

          <p>Recibimos una solicitud para restablecer tu contraseña
          de VitalMove.</p>

          <p>Hacé clic en el siguiente enlace:</p>

          <a href="${resetUrl}">
            Restablecer contraseña
          </a>

          <p>Este enlace vence en 15 minutos.</p>

          <p>Si no solicitaste este cambio, podés ignorar este correo.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw new InternalServerErrorException(
        'No se pudo enviar el correo electrónico',
      );
    }
  }
}
