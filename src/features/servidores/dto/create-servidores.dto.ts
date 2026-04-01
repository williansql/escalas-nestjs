export class CreateServidoresDto {
    id?: number;
    nomeCompleto: string;
    matricula: string;
    cpf: string;
    funcao: string;
    equipe?: {
        id: number;
    };
    status: boolean;
    equipeId?: number;
    cargaHoraria: number;
    criadoQuando?: Date;
    criadoPor?: string;
    atualizadoQuando?: Date;
    atualizadoPor?: string;
}
