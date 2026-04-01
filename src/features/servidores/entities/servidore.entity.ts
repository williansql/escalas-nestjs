export class Servidores {
    id: number;
    nomeCompleto: string;
    matricula: string;
    cpf: string;
    funcao: string;
    equipeId?: number;
    status: boolean;
    cargaHoraria: number;
    criadoQuando: Date;
    criadoPor?: string;
    atualizadoQuando?: Date;
    atualizadoPor?: string;
}
