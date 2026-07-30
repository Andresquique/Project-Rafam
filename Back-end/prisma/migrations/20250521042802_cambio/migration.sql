/*
  Warnings:

  - You are about to drop the `Credenciales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_credencialesId_fkey";

-- DropTable
DROP TABLE "Credenciales";

-- CreateTable
CREATE TABLE "Credencial" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credencial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credencial_email_key" ON "Credencial"("email");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_credencialesId_fkey" FOREIGN KEY ("credencialesId") REFERENCES "Credencial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
