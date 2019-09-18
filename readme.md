<h1 align="center">

![](https://user-images.githubusercontent.com/28466370/65008804-ebb08980-d8e0-11e9-8cd3-429342052438.png)
<br />
Meetapp Backend

</h1>

<p align="center">
  <a href="#tecnologias-utilizadas">Tecnologias utilizadas</a> |
  <a href="#como-usar">Como Usar</a> |
  <a href="#rotas">Rotas</a>
</p>

Este é o backend de um projeto criado para o desafio final no Bootcamp da Rocketseat. Nele desenvolvemos um serviço onde os usuários podem criar eventos através da [aplicação Web](https://github.com/rodrigodasilva/meetapp-front-web) feita em ReactJS, e se inscrever nestes eventos utilizando o [aplicativo](https://github.com/rodrigodasilva/meetapp-mobile) feito em React-native, sendo toda a lógica gerenciada por esta api desenvolvida em NodeJS.

## Tecnologias utilizadas

- [sentry/node]()
- [bcryptjs]()
- [bee-queue]()
- [cors]()
- [date-fns](https://github.com/date-fns/date-fns)
- [dotenv]()
- [express]()
- [express-async-errors]()
- [express-handlebars]()
- [jsonwebtoken]()
- [multer]()
- [nodemailer]()
- [nodemailer-express-handlebars]()
- [pg]()
- [pg-hstore]()
- [sequelize]()
- [sequelize-cli]()
- [youch]()
- [yup]()

## Como usar

#### Pré-requisitos

Ferramentas

- Yarn/Npm
- Docker

Serviços

- Postgres
- Redis

#### Configurando as variavéis de ambiente

1. Renomeamos o arquivo '.env_example' para '.env' e substituimos as informações de configuração conforme explicado nos passos seguintes

2. Definimos uma chave secreta para a aplicação

```
APP_SECRET=bootcampmeetapp
```

3. É necessário ter uma instância do banco de dados postgres rodando e, a partir dela criar uma base de dados, adicionando então, estes dados ao arquivo de configuração

```
# Database
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
```

4. Instânciamos também o redis para utilizar as filas no envio de email, caso não esteja utilizando sua configuração padrão, altere-as no arquivo .env

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

5. Para simularmos o envio de emails utilizamos o serviço [mailtrap.io](https://mailtrap.io), logo, sugerimos que crie sua conta e substitua os dados fornecidos por eles nas linhas abaixo do arquivo .env

```
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```

#### Rodando a aplicação

Depois de configurada as variavéis de ambiente e, tendo o postgres e o redis rodando podemos iniciar a api

1. Rodamos o comando yarn para fazer a instalação das dependências passadas no package.json

   > yarn

2. Executamos as migrations para criar as tabelas no banco de dados

   > yarn sequelize db:migrate

3. Rodamos a aplicação da api

   > yarn dev

4. Rodamos a aplição da fila

   > yarn queue

### Rotas

Se tudo ocorreu bem até aqui significa que a api está rodando, sendo assim podemos testar suas funcionalidades

#### User

- Create

```json
/** Requisição
 * - Tipo: POST
 * - Rota: /users
 * - Body:
 *   > name: string
 *   > email: email
 *   > password: string de mínimo 6 caracteres
 **/

// Ex. de requisição
{
  "name": "Maria Joaquina",
  "email": "maria@teste.com.br",
  "password": "123456"
}
```

- Update (necessário ter iniciado a sessão antes)

```json
/** Requisição
 * - Tipo: PUT
 * - Rota: /users
 * - Body:
 *   > name: string
 *   > email: email
 *   > oldPassword: string de mínimo 6 caracteres
 *   > password: string de mínimo 6 caracteres
 *   > confirmPassword: string de mínimo 6 caracteres
 **/

// Ex. de requisição
{
  "name": "Maria Joaquina Teste",
  "email": "maria@teste.com",
  "oldPassword": "123456",
  "password": "1234567",
  "confirmPassword": "1234567"
}
```

#### Session

- Create

```json
/** Requisição
 * - Tipo: POST
 * - Rota: /sessions
 * - Body:
 *   > email
 *   > password
 **/

// Ex. de requisição
{
  "email": "maria@teste.com",
  "password": "123456"
}
```

Todas as rotas a partir daqui requerem **autenticação na sessão**

#### Files

- Create

```json

/** Requisição
 * - Tipo: POST
 * - Rota: /files
 * - Body:
 *   > file: arquivo (tipo multipart form)
 **/
```

#### Meetups

- Index: lista todos os meetups

```json
/** Requisição
 * - Tipo: GET
 * - Rota: /meetups
 * - Query params:
 *   > date: data (formato 'YYYY-MM-DD')
 *   > page: opcional
 **/

// Ex. de requisição
"http://localhost:3333/meetups?date=2019-09-15&page=2"
```

- Show: lista apenas um meetup

```json
/** Requisição
 * - Tipo: GET
 * - Rota: /meetups/:id
 * - Params:
 *   > id: number
 **/

// Ex. de requisição
"http://localhost:3333/meetups/5"
```

- Create

```json
/** Requisição
 * - Tipo: POST
 * - Rota: /meetups
 * - Body:
 *   > title: string
 *   > description: string
 *   > location: string
 *   > date: data (formato ISO "YYYY-MM-DDTHH:mm:ss.sssZ")
 *   > banner_id: number (id do banner que se deseja associar)
 **/

// Ex. de requisição
{
  "title": "Meetup de teste",
  "description": "Descrição do meetup de teste",
  "location": "Algum lugar",
  "date": "2019-09-18 23:00:00",
  "banner_id": 7
}
```

- Update: edita o meetup caso sua data não tenha passado

```json
/** Requisição
 * - Tipo: PUT
 * - Rota: /meetups
 * - Body:
 *   > title: string
 *   > description: string
 *   > location: string
 *   > date: data (formato ISO "YYYY-MM-DDTHH:mm:ss.sssZ")
 *   > banner_id: number (id do banner que se deseja associar)
 **/

// Ex. de requisição
{
  "title": "Meetup",
  "description": "Descrição do meetup",
  "location": "Algum lugar",
  "date": "2019-09-18 23:00:00",
  "banner_id": 10
}
```

- Delete

```json
/** Requisição
 * - Tipo: DELETE
 * - Rota: /meetups/:id
 * - Params:
 *   > id: number
 **/

// Ex. de requisição
"http://localhost:3333/meetups/5"
```

#### Organizing

- Index: lista os meetups que o usuário autenticado é organizador

```json
/** Requisição
 * - Tipo: GET
 * - Rota: /organizing
 * - Query params:
 *   > page: opcional
 **/

// Ex. de requisição
"http://localhost:3333/organizing?page=3"
```

#### Subscriptions

- Index: lista os meetups que ainda não aconteceram em que o usuário autenticado se inscreveu

```json
/** Requisição
 * - Tipo: GET
 * - Rota: /subscriptions
 **/
```

- Create

```json
/** Requisição
 * - Tipo: POST
 * - Rota: /meetups/:id/subscriptions
 * - Params:
 *   > id: number (id do meetup no qual que se deseja inscrever)
 **/

// Ex. de requisição
"http://localhost:3333/meetups/5/subscriptions"
```

- Delete

```json
/** Requisição
 * - Tipo: DELETE
 * - Rota: /meetups/:id/subscriptions
 * - Params:
 *   > id: number (id do meetup que deseja cancelar a inscrição)
 **/

// Ex. de requisição
"http://localhost:3333/meetups/5/subscriptions"``
```
