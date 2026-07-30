-- CreateTable
CREATE TABLE "Credenciales" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credenciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "credencialesId" INTEGER NOT NULL,
    "nombre" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "edad" INTEGER,
    "nivel_actual_id" INTEGER NOT NULL,
    "fecha_ultima_evaluacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero_orden" INTEGER NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url_video" TEXT NOT NULL,
    "url_miniatura" TEXT NOT NULL,
    "zona_muscular_id" INTEGER NOT NULL,
    "nivel_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonaMuscular" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonaMuscular_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credenciales_email_key" ON "Credenciales"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_credencialesId_key" ON "Perfil"("credencialesId");

-- CreateIndex
CREATE UNIQUE INDEX "Nivel_numero_orden_key" ON "Nivel"("numero_orden");

-- CreateIndex
CREATE UNIQUE INDEX "ZonaMuscular_nombre_key" ON "ZonaMuscular"("nombre");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_credencialesId_fkey" FOREIGN KEY ("credencialesId") REFERENCES "Credenciales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_nivel_actual_id_fkey" FOREIGN KEY ("nivel_actual_id") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_zona_muscular_id_fkey" FOREIGN KEY ("zona_muscular_id") REFERENCES "ZonaMuscular"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
