-- DropForeignKey
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_credencialesId_fkey";

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_credencialesId_fkey" FOREIGN KEY ("credencialesId") REFERENCES "Credencial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
