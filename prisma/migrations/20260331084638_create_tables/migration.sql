-- CreateTable
CREATE TABLE "Usuarios" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "refreshToken" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT NOT NULL,
    "atualizadoQuando" DATETIME NOT NULL,
    "atualizadoPor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Servidores" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "nomeCompleto" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "equipe" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "cargaHoraria" INTEGER NOT NULL,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT NOT NULL,
    "atualizadoQuando" DATETIME NOT NULL,
    "atualizadoPor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Equipes" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "nomeEquipe" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "codigoVtr" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT NOT NULL,
    "atualizadoQuando" DATETIME NOT NULL,
    "atualizadoPor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Afastamentos" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "servidorId" BIGINT NOT NULL,
    "tipoAfastamento" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "motivo" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT NOT NULL,
    "atualizadoQuando" DATETIME NOT NULL,
    "atualizadoPor" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Servidores_matricula_key" ON "Servidores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Servidores_cpf_key" ON "Servidores"("cpf");

-- CreateIndex
CREATE INDEX "Afastamentos_servidorId_idx" ON "Afastamentos"("servidorId");
