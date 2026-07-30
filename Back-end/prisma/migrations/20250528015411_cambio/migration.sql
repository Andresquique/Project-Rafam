/*
  Warnings:

  - You are about to drop the column `edad` on the `Perfil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "edad",
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3);
