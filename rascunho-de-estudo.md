# Arquivo de rascunho utilizado para estudo
## Configurações do projeto
Iniciamos o arquivo 'package.json' e adicionamos o 'express' para iniciar o projeto
> yarn init
> yarn add express

### Nodemon e sucrase
- nodemon: reinica o servidor automaticamente ao salvar o arquivo
- sucrase: permite ao node utilizar as novas features do javascript
  1. yarn add sucrase nodemon -D
  2. No arquivo 'package.json' adiciona
  ```
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  ```
  3. Cria um arquivo de configuração 'nodemon.json'
  ```
  {
    "execMap": {
      "js": "sucrase-node"
    }
  }
  ```
  4. Roda o servidor
    > yarn dev

### ESlint, Prettier e EditorConfig
  1. Adiciona o 'eslint' como depedencia de desenvolvimento
      > yarn add eslint -D
  2. Inicializa o arquivo de configuração do eslint
      > yarn eslint --init
  3. Seleciona as seguintes opções que vão aparecer no terminal
    3.1. How would you like to use ESLint?
      To check syntax only
      To check syntax and find problems
    ❯ To check syntax, find problems, and enforce code style

    3.2. What type of modules does your project use? (Use arrow keys)
    ❯ JavaScript modules (import/export)
      CommonJS (require/exports)
      None of these

    3.3. Which framework does your project u
    se? (Use arrow keys)
      React
      Vue.js
    ❯ None of these

    3.4. Where does your code run?
      ◯ Browser
    ❯ ◉ Node

    3.5. How would you like to define a style for your project?
    (Use arrow keys)
    ❯ Use a popular style guide
      Answer questions about your style
      Inspect your JavaScript file(s)

    3.6. Which style guide do you want to follow? (Use arrow keys)
    ❯ Airbnb (https://github.com/airbnb/javascript)
      Standard (https://github.com/standard/standard)
      Google (https://github.com/google/eslint-config-google)

    3.7. What format do you want your config file to be in? (Use arrow keys)
    ❯ JavaScript
      YAML
      JSON

  4. A instalação é feita por padrão utilizando o 'npm', o que gera
      um arquivo 'package-lock.json', mas como estamos trabalhando
      com o yarn, removemos este arquivo e rodamos o yarn para realizar
      o mapeamento das novas dependencias no 'yarn.lock'
      > yarn

  5. Instala a extenção ESlint na IDE
  6. No arquivo 'settings.json' do VSCode adicione
  ```
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "javascriptreact",
      "autoFix": true
    }
  ],
  ```
  7. Adiciona as bibliotecas para integração do ESlint com o Prettier
      > yarn add prettier eslint-config-prettier eslint-plugin-prettier -D

  8. Configuramos o arquivo '.eslint.js'
  ```
  module.exports = {
    env: {
      es6: true,
      node: true,
    },
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
      "prettier/prettier": "error",
      "class-methods-use-this": "off",
      "no-param-reassign": "off",
      "camelcase": "off",
      "no-unused-vars": ["error", {"argsIgnorePattern": "next"}],
    }
  };
  ```
  9. Cria um arquivo '.prettierrc' para resolver problema de regras duplicadas entre o ESlint e o Prettier
  ```
  {
    "singleQuote": true,
    "trailingComma": "es5"
  }
  ```

  10. Dá um fix em todos os arquivos '.js' na pasta 'src'
      > yarn eslint --fix src --ext .js

  11. Instala o plugin EditorConfig no VSCode
  12. Cria um arquivo '.editorconfig' clicando com o botão direito na raiz do projeto e escolhendo a opção 'Generate .editorconfig'
  13. Cola o código abaixo no arquivo citado acima
  ```
  root = true

  [*]
  indent_style = space
  indent_size = 2
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  ```

### Sequelize e Postgres (Utilizando Docker)
- Bilbioteca ORM utilizada para abstrair o trabalho com o banco de dados
1. Configura o banco de dados Postgres utilizando o Docker
    > docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
2. Baixar e instalar o App "PostBird" para utilizar o Postgres com interface gráfica
3. Inicia o container com o database
    > docker start database
4. Cria o arquivo de configuração '.sequelizerc'
  ```
  const { resolve } = require('path');
  module.exports = {
    config: resolve(__dirname, 'src', 'config', 'database.js'),
    'models-path': resolve(__dirname, 'src', 'app', 'models'),
    'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
    'seeds-path': resolve(__dirname, 'src', 'app', 'seeds'),
  };
  ```
5. Adicioa as depedências 'pg' e 'pg-hstore' para trabalhar com o postgres
    > yarn add pg pg-hstore

#### Comandos Sequelize
- Primeiramente adicionamos as dependências para facilitar a utilização na linha de comando
  > yarn add sequelize
  > yarn add sequelize-cli
  - Inicia a migration de usuarios
    > yarn sequelize migration:create --name=create-users
  - Roda a migração
    > yarn sequelize db:migrate
  - Desfaz a ultima migração
    > yarn sequelize db:migrate:undo
  - Desfaz todas as migrações
    > yarn sequelize db:migrate:undo:all

### Dependências adicionadas no decorrer do projeto
- Encriptação das senhas
  > yarn add bcryptjs
- Trabalhar com JWT (Jason Web Token)
  > yarn add jsonwebtoken
- Validação dos dados
  > yarn add yup
- Trabalhar com datas. @next para instalar a versão atual
  > yarn add date-fns@next

### Configurando o Multer
1. Adiciona sua dependência
    > yarn add multer
2. Cria uma pasta 'tmp' e dentro dela outra chamada 'uploads' para armazenar
  os arquivos
3. Cria um arquivo de configuração 'multer.js' na pasta 'config'
```
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
```

### Envio de email com 'Nodemailer' e fila utilizando 'Redis'
- Inicialmente criamos um arquivo 'mail.js' na pasta 'config' para armazenar os dados de configuração do serviço de email utilizado.
```
export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe MeetApp <noreply@meetapp.com>',
  },
};
```

- Para este projeto (MeetApp) utilizamos o 'mailtrap.io' para simular o envio de emails. Criamos então uma conta no site deste serviço e substituimos os dados no arquivo de configuração citado acima.

- Criamos uma pasta 'lib' na pasta 'src' e, dentro dela criamos o arquivo 'Mail.js', que será responsável inicialmente, por enviar os emails
```
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
```
- Importamos no arquivo que se deseja enviar o email. No caso do MeetApp é no 'SubscriptionController'
```
import Mail from '../../lib/Mail';
```
- E enviamos o email
```
await Mail.sendMail({
  to: `${user.name} <${user.email}>`,
  subject: 'New subscription',
  text: 'You have a new subscription',
});
```

- Para melhorar a aparência dos emails utilizamos o 'handlebars'
  > yarn add express-handlebars nodemailer-express-handlebars
- E importamos em 'Mail.js'
```
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
```
- Criamos o metodo 'configureTemplates' e inicializa no construtor do arquivo 'Mail.js'
```
constructor() { ... this.configureTemplates(); ... }

configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
```

- Criamos a estrutura de pasta dentro de 'app' para armazenar os templates de emails
```
|-views
  |-emails
    |-layouts
      default.hbs
    |-partials
      footer.hbs
    subscription.hbs
```

- default.hbs
```
<div style="font-family: Arial, Helvetica, sans-serif;
font-size: 16px; line-height: 1.6; color:#222;
max-width: 600px">
  {{{ body }}}
  {{> footer }}
</div>
```
- footer.hbs
```
<br />
Equipe MeetApp
```
- subscriptions.hbs
```
Olá,<strong> {{ organizer }}</strong>
<p> Houve uma nova inscrição no seu evento: </p>
<p>
  <strong>Título:</strong> {{ title }} <br />
  <strong>Data:</strong> {{ meetupDate }}
</p>
<p>Realizada por: </p>
<p>
  <strong>Nome: </strong> {{ user }} <br />
  <strong>Email: </strong> {{ email }} <br />
  <strong>Data da inscrição: </strong> {{ subscriptionDate }} <br />
</p>

```

- Alteramos a função de envio do email no 'SubscriptionController' para utilizar o template de email
```
await Mail.sendMail({
  to: `${meetup.User.name} <${meetup.User.email}>`,
  subject: 'Nova Inscrição',
  template: 'subscription',
  context: {
    organizer: meetup.User.name,
    title: meetup.title,
    user: user.name,
    email: user.email,
    meetupDate: format(meetup.date, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    }),
    subscriptionDate: format(new Date(), "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    }),
  },
});
```

#### Configurando o envio de email utilizando filas
- Utilizamos o banco de dados não-relacional 'redis'
- Para isso, criamos uma instância do banco utilizando o 'docker'
  > docker run --name redismeetapp -p 6379:6379 -d -t redis:alpine
- E adicionamos o 'bee-queue', que é uma ferramenta de fila para o node
  > yarn add beyarn add bee-queuee-queue
- Na pasta 'lib' criamos um arquivo 'Queue.js' e inicilizamos suas configurações
```
import Bee from 'bee-queue';

class Queue {
  constructor() {
    this.queue = [];

    this.init();
  }

  init();
}

export default new Queue();
```
- Na pasta 'app' criamos a pasta 'jobs', que será responsável por armazenar os arquivos de processos que trabalham em background. Dentro de 'jobs' criamos o arquivo 'SubscriptionMail.js'
- Recortamos a parte de envio de email no 'SubscriptionController.js' para o 'SubscriptionMail.js'
```
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

/**
 * Job responsável por enviar um email ao organizador sempre que houver
 * uma nova inscrição no seu meetupp
 */

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { user, meetup } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `Nova Inscrição [${meetup.title}]`,
      template: 'subscription',
      context: {
        organizer: meetup.User.name,
        title: meetup.title,
        user: user.name,
        email: user.email,
        meetupDate: format(
          parseISO(meetup.date),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        subscriptionDate: format(new Date(), "dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}
export default new SubscriptionMail();
```

- Adicionamos os dados de configuração do 'redis' em 'redis.js' na pasta 'config'.
```
export default {
  host: '127.0.0.1',
  port: 6379,
};
```
- Fazendo sua importação em 'Queue.js' e concluindo as configurações deste arquivo
```
import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import redisConfig from '../config/redis';

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = [];

    this.init();
  }

  /**
   * Percorre os jobs, acessando o key e o handle de cada job
   * armazenando em 'this.queues' a fila em 'bee', com uma instancia do redis
   * e o 'handle', que é o método responsavel por processar o job
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Método responsável por adicionar novos trabalhos à fila
   * Ex: sempre que um novo email for disparado, ele adiciona
   * esse novo job dentro da fila para ele ser processado
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Método responsável por processar as filas
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /**
   * Método responsável por processar os erros
   */
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();

```
- Em 'SubscriptionController' importamos a fila ao invés de importar do email('Mail.js') e importando também o job de 'SubscriptionMail'
```
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';
```
- E adicionamos o envio de email à fila após salvar na tabela
```
await Queue.add(SubscriptionMail.key, {
  user,
  meetup,
});
```

- Na pasta 'src' criamos um arquivo 'queue.js'. Este arquivo faz com que a exececução
  da fila esteja num processo diferente do da aplicação, tornando-a mais performatica
```
import 'dotenv/config';
import Queue from './lib/Queue';
Queue.processQueue();
```
- Executamos a fila
  > node src/queue.js
    - **Obs**: Esse comando vai gerar **_erro_**, pois este arquivo não esta utilizando o 'sucrase'*
    - Para resolver este erro adicionamos aos 'scripts' em 'package.json' o comando 'queue'
    ```
    "queue": "nodemon src/queue.js "
    ```
  - E rodamos
    > yarn queue

### Configurando o 'Sentry'
  - Utilizado para tratamento de errors e exceções na aplicação
- Primeiramente criamos uma conta em 'sentry.io' e iniciamos o projeto. Feito isso, o próprio site nos informa uma série de configurações que devem ser feitas em nosso projeto, que são basicamente o passos descritos logo abaixo
  > yarn add @sentry/node@5.5.0
- Na pasta 'config' criamos um arquivo 'sentry.js' e adicionamos o 'dsn' gerado no momento da criação do projeto no site
- Por padrão o 'express' não consegue captar os erros que acontece no 'async', com isso ele não vai enviar para o 'sentry'. Para resolver este problema utilizamos a extensão express-async-errors
  > yarn add express-async-errors
- Adicionamos também a dependência do 'youch' para fazer a tratativa das mensagens de error para que o desenvolvedor possa visualiza-las melhor
  > yarn add youch

- Em 'app.js' importamos o 'Sentry' e suas configurações, modificando este arquivo ele ficará conforme abaixo. As linhas iniciadas com '->' foram as configurações necessárias para utilizar o 'sentry'
```
import 'dotenv/config';
import express from 'express';
-> import Youch from 'youch';
-> import * as Sentry from '@sentry/node';
-> import 'express-async-errors';
-> import sentryConfig from './config/sentry';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

->  Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
->  this.exceptionHandler();
  }

  middlewares() {
->  this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
->  this.server.use(Sentry.Handlers.errorHandler());
  }

->exceptionHandler() {
->  /**
->   * Cria o middleware de tratamento de excessão
->   */
->  this.server.use(async (err, req, res, next) => {
->    if (process.env.NODE_ENV === 'development') {
->      const errors = await new Youch(err, req).toJSON();

->      return res.status(500).json(errors);
->    }

->    return res.status(500).json({ error: 'Internal server error' });
->  });
->}
}

export default new App().server;
```









