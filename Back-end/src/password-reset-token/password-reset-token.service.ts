import { Injectable } from '@nestjs/common';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly passwordResetToken: PasswordResetToken) {}

  async findByHash(tokenHash: string) {
    return this.passwordResetToken.findByHash(tokenHash);
  }

  async create(tokenHash: string, userId: number, expiresAt: Date) {
    return this.passwordResetToken.create(tokenHash, userId, expiresAt);
  }

  async deleteByUserId(userId: number) {
    return this.passwordResetToken.deleteByUserId(userId);
  }

  async deleteById(id: number) {
    return this.passwordResetToken.deleteById(id);
  }

  async completePasswordReset(
    tokenId: number,
    userId: number,
    hashedPassword: string,
  ) {
    return this.passwordResetToken.completePasswordReset(
      tokenId,
      userId,
      hashedPassword,
    );
  }
}
