import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PasswordResetToken {
  constructor(private readonly prisma: PrismaService) {}

  async findByHash(tokenHash: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
  }

  async create(tokenHash: string, userId: number, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  }

  async deleteByUserId(userId: number) {
    return this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  async deleteById(id: number) {
    return this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }

  async completePasswordReset(
    tokenId: number,
    userId: number,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.passwordResetToken.updateMany({
        where: {
          id: tokenId,
          used: false,
          expiresAt: { gt: new Date() },
        },
        data: { used: true },
      });

      if (result.count !== 1) {
        return false;
      }

      await tx.credencial.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.updateMany({
        where: {
          userId,
          used: false,
        },
        data: { used: true },
      });

      return true;
    });
  }
}
