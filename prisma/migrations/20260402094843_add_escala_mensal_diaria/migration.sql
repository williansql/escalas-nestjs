-- CreateTable
CREATE TABLE "EscalaMensal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "geradaEm" DATETIME,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPor" TEXT,
    "atualizadoQuando" DATETIME,
    "atualizadoPor" TEXT
);

-- CreateTable
CREATE TABLE "EscalaDiaria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "escalaId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "sobreavisoEquipeId" INTEGER,
    "servidoresEscalados" JSONB NOT NULL DEFAULT [],
    "observacao" TEXT,
    "criadoQuando" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoQuando" DATETIME,
    CONSTRAINT "EscalaDiaria_escalaId_fkey" FOREIGN KEY ("escalaId") REFERENCES "EscalaMensal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EscalaMensal_mes_ano_key" ON "EscalaMensal"("mes", "ano");

-- CreateIndex
CREATE INDEX "EscalaDiaria_escalaId_idx" ON "EscalaDiaria"("escalaId");

-- CreateIndex
CREATE INDEX "EscalaDiaria_data_idx" ON "EscalaDiaria"("data");
