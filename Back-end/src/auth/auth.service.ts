import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CredencialService } from '../../src/credencial/credencial.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { createHash, randomBytes } from 'node:crypto';
import { PasswordResetTokenService } from 'src/password-reset-token/password-reset-token.service';

@Injectable()
export class AuthService {
  constructor(
    private credencial: CredencialService,
    private jwtService: JwtService,
    private passwordResetTokenService: PasswordResetTokenService,
    private mailService: MailService,
  ) {}

  generateToken(
    userId: number,
    email: string,
    rol: string,
    nivel_actual_id: number,
  ): { access_token: string } {
    const payload = { userId, email, rol, nivel_actual_id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(dto: AuthDto): Promise<{ access_token: string }> {
    const existingUser = await this.credencial.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.credencial.create(dto.email, hashed);

    return this.generateToken(
      user.id,
      user.email,
      user.perfil!.rol,
      user.perfil!.nivel_actual_id,
    );
  }

  async login(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.credencial.findByEmail(dto.email);

    const isValid = user && (await bcrypt.compare(dto.password, user.password));
    if (!isValid) {
      throw new UnauthorizedException('Password o email incorrecto');
    }

    return this.generateToken(
      user.id,
      user.email,
      user.perfil!.rol,
      user.perfil!.nivel_actual_id,
    );
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const message =
      'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.';

    const user = await this.credencial.findByEmail(email);

    if (!user) {
      return { message };
    }

    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetTokenService.deleteByUserId(user.id);

    const resetToken = await this.passwordResetTokenService.create(
      tokenHash,
      user.id,
      expiresAt,
    );

    try {
      await this.mailService.sendPasswordResetEmail(user.email, token);
    } catch (error) {
      // Si falla el envío, eliminar el token creado.
      await this.passwordResetTokenService.deleteById(resetToken.id);
      throw error;
    }

    return { message };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const resetToken =
      await this.passwordResetTokenService.findByHash(tokenHash);

    if (!resetToken || resetToken.used || resetToken.expiresAt <= new Date()) {
      throw new UnauthorizedException(
        'El enlace de recuperación es inválido o ha expirado',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const completed =
      await this.passwordResetTokenService.completePasswordReset(
        resetToken.id,
        resetToken.userId,
        hashedPassword,
      );

    if (!completed) {
      throw new UnauthorizedException(
        'El enlace de recuperación es inválido o ha expirado',
      );
    }

    return {
      message: 'La contraseña se actualizó correctamente',
    };
  }
}
