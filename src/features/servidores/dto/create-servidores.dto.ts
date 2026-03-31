export class CreateServidoresDto {
    id: number;
    nomeCompleto: string;
    matricula: string;
    cpf: string;
    funcao: string;
    equipe: string;
    status: boolean;
    cargaHoraria: number;
    criadoQuando: Date;
    criadoPor?: string;
    atualizadoQuando?: Date;
    atualizadoPor?: string;
}
