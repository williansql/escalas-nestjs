# Integração Angular com o backend NestJS

Base URL padrão do backend:
- `http://localhost:3000`

Todos os endpoints usam JSON.
No Angular, configure o `HttpClient` e envie as requisições com `Content-Type: application/json`.

---

## 1. Servidores

### Endpoints
- `GET /servidores` - lista todos os servidores.
- `GET /servidores/:id` - busca servidor pelo `id`.
- `POST /servidores` - cria novo servidor.
- `PATCH /servidores/:id` - atualiza servidor existente.
- `DELETE /servidores/:id` - remove servidor.

### Objeto esperado para criação
```json
{
  "nomeCompleto": "João Silva",
  "matricula": "12345",
  "cpf": "000.000.000-00",
  "funcao": "Motorista",
  "equipe": "Equipe A",
  "status": true,
  "cargaHoraria": 40,
  "criadoPor": "admin"
}
```

### Observações
- `status` é booleano.
- `cargaHoraria` é número.
- `matricula` e `cpf` são únicos.
- Para atualização, você pode enviar apenas os campos que deseja alterar.

### Interface Angular sugerida
```ts
export interface Servidor {
  id: number;
  nomeCompleto: string;
  matricula: string;
  cpf: string;
  funcao: string;
  equipe: string;
  status: boolean;
  cargaHoraria: number;
  criadoQuando: string;
  criadoPor?: string;
  atualizadoQuando?: string;
  atualizadoPor?: string;
}
```

### Exemplo de serviço Angular
```ts
@Injectable({ providedIn: 'root' })
export class ServidoresService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Servidor[]>(`${this.apiUrl}/servidores`);
  }

  getById(id: number) {
    return this.http.get<Servidor>(`${this.apiUrl}/servidores/${id}`);
  }

  create(data: Partial<Servidor>) {
    return this.http.post<Servidor>(`${this.apiUrl}/servidores`, data);
  }

  update(id: number, data: Partial<Servidor>) {
    return this.http.patch<Servidor>(`${this.apiUrl}/servidores/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/servidores/${id}`);
  }
}
```

---

## 2. Equipes

### Endpoints
- `GET /equipes` - lista todas as equipes.
- `GET /equipes/:id` - busca equipe pelo `id`.
- `POST /equipes` - cria nova equipe.
- `PATCH /equipes/:id` - atualiza equipe existente.
- `DELETE /equipes/:id` - remove equipe.

### Objeto esperado para criação
```json
{
  "nomeEquipe": "Equipe Alfa",
  "descricao": "Equipe de plantão",
  "codigoVtr": "VTR-001",
  "cor": "azul",
  "status": true,
  "servidoresId": [1, 2, 3],
  "criadoPor": "admin"
}
```

### Observações
- `servidoresId` é armazenado como JSON no banco e deve ser enviado como um array de IDs.
- Se não houver servidores vinculados, envie `[]` ou omita o campo.
- `descricao` é opcional, mas o modelo Prisma exige uma string no cadastro.

### Interface Angular sugerida
```ts
export interface Equipe {
  id: number;
  nomeEquipe: string;
  descricao?: string;
  codigoVtr: string;
  cor: string;
  status: boolean;
  servidoresId: number[];
  criadoQuando: string;
  criadoPor?: string;
  atualizadoQuando?: string;
  atualizadoPor?: string;
}
```

### Exemplo de serviço Angular
```ts
@Injectable({ providedIn: 'root' })
export class EquipesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Equipe[]>(`${this.apiUrl}/equipes`);
  }

  getById(id: number) {
    return this.http.get<Equipe>(`${this.apiUrl}/equipes/${id}`);
  }

  create(data: Partial<Equipe>) {
    return this.http.post<Equipe>(`${this.apiUrl}/equipes`, data);
  }

  update(id: number, data: Partial<Equipe>) {
    return this.http.patch<Equipe>(`${this.apiUrl}/equipes/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/equipes/${id}`);
  }
}
```

---

## 3. Afastamentos

### Endpoints
- `GET /afastamentos` - lista todos os afastamentos.
- `GET /afastamentos/:id` - busca afastamento pelo `id`.
- `POST /afastamentos` - cria novo afastamento.
- `PATCH /afastamentos/:id` - atualiza afastamento existente.
- `DELETE /afastamentos/:id` - remove afastamento.

### Objeto esperado para criação
```json
{
  "servidorId": 1,
  "tipo": "Licença",
  "dataInicio": "2026-04-01T00:00:00.000Z",
  "dataFim": "2026-04-10T00:00:00.000Z",
  "motivo": "Problemas de saúde",
  "status": true,
  "criadoPor": "admin"
}
```

### Observações
- `dataInicio` e `dataFim` devem ser datas válidas (ISO 8601 funciona bem no Angular).
- Você pode enviar `observacao` em vez de `motivo`; o backend grava esse texto em `motivo`.
- O campo `tipo` é mapeado internamente para `tipoAfastamento` no banco.

### Interface Angular sugerida
```ts
export interface Afastamento {
  id: number;
  servidorId: number;
  tipo?: string;
  dataInicio: string;
  dataFim: string;
  motivo?: string;
  observacao?: string;
  status: boolean;
  criadoQuando: string;
  criadoPor?: string;
  atualizadoQuando?: string;
  atualizadoPor?: string;
}
```

### Exemplo de serviço Angular
```ts
@Injectable({ providedIn: 'root' })
export class AfastamentosService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Afastamento[]>(`${this.apiUrl}/afastamentos`);
  }

  getById(id: number) {
    return this.http.get<Afastamento>(`${this.apiUrl}/afastamentos/${id}`);
  }

  create(data: Partial<Afastamento>) {
    return this.http.post<Afastamento>(`${this.apiUrl}/afastamentos`, data);
  }

  update(id: number, data: Partial<Afastamento>) {
    return this.http.patch<Afastamento>(`${this.apiUrl}/afastamentos/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/afastamentos/${id}`);
  }
}
```

---

## 4. Usuários

### Endpoints
- `GET /usuarios` - lista todos os usuários.
- `GET /usuarios/:id` - busca usuário por `id`.
- `POST /usuarios` - cria usuário.
- `PATCH /usuarios/:id` - atualiza usuário.
- `DELETE /usuarios/:id` - remove usuário.

### Objeto esperado para criação
```json
{
  "nomeCompleto": "Maria Souza",
  "email": "maria@example.com",
  "senha": "senha123",
  "role": "ADMIN"
}
```

### Observações
- `role` é opcional no DTO, mas pode ser útil para controle de acesso.
- Senha deve ser enviada em texto claro no JSON, e o backend deve tratar hashing em serviço.

---

## 5. Autenticação (opcional)

### Endpoints de autenticação
- `POST /auth/login` - realiza login.
  - corpo: `{ "email": "...", "senha": "..." }`
- `POST /auth/refresh` - renova token usando refresh token.
- `GET /auth/me` - retorna perfil do usuário autenticado.

### Uso no Angular
- Armazene o token JWT recebido no login.
- Envie no cabeçalho `Authorization: Bearer <token>` para rotas protegidas.
- Para obter o perfil atual, use `GET /auth/me` com o token.

---

## 6. Dicas de integração

- Sempre use `HttpClient` do Angular.
- Para datas, envie `new Date(...).toISOString()`.
- Para atualizar registros, use `PATCH` e envie apenas os campos alterados.
- Para `Equipes.servidoresId`, envie um array de IDs: `[1, 2, 3]`.
- Caso precise de um `criadoPor`, envie o nome ou email do usuário que está criando o registro.

## Exemplo de chamada Angular com headers
```ts
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

this.http.post<Equipe>(`${this.apiUrl}/equipes`, body, { headers });
```
