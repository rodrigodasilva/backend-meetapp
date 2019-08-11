# Desafio 3 realizado no Bootcamp da Rocketseat
Esta é a parte backend de um projeto chamado 'MeetApp' que faz parte do [desafio 03](https://github.com/Rocketseat/bootcamp-gostack-desafio-03) proposto no Bootcamp da Rocktseat.

Em resumo, trata-se de uma API que fornece a lógica e as rotas para que o usuário possa logar e criar 'meetups' (reuniões) onde outros usuários possam se inscrever para participar.

### Inicialização do projeto
- Para os que desejam rodar o projeto em sua máquina, basta seguir os passos abaixo e realizar os testes
- Requisitos:
  - Node/NPM
  - Yarn
  - Docker
1. Instânciamos o banco de dados 'postgres' com o 'docker', passando o 'name' como 'database' e o 'password' como 'docker' na porta 5432.
    - Executando pela primeira vez, utilizamos o comando 'run' para criar o container do 'postgres'
      > docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
    - A partir da segunda vez, basta startar o servidor
      > docker start database
2. Instânciamos também o 'redis' para utilizar as filas no envio de email
    - Executando pela primeira vez, utilizamos o comando 'run' para criar o container do 'redis'
      > docker run --name redismeetapp -p 6379:6379 -d -t redis:alpine
    - Executando pela segunda vez
      > docker start redismeetapp

3. Rodamos o comando yarn para fazer a instalação das dependências passadas no 'package.json'
    > yarn
4. Rodamos a aplicação da api
    > yarn dev
5. Rodamos a aplição da fila
    > yarn queue
6. Executamos as 'migrations' para criar as tabelas no banco de dados
  > yarn sequelize db:migrate

