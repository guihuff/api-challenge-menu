# Desafio AU

Este documento é referente aos requisitos e modelagem do sistema para o desafio *fullstack* da Academia do Universitário.

## Backend

**Tecnologias:**

- NestJS;
- TypeScript;
- JavaScript;
- NodeJS;
- Yarn
- (MongoDB, MySQL); [https://planetscale.com/pricing](https://planetscale.com/pricing)
- Prisma.orm;
- Docker;
- Git;
- Github Actions.
- Rest Client ([https://dev.to/leandroats/vscode-rest-client-2cei](https://dev.to/leandroats/vscode-rest-client-2cei))
- Draw.io

**Bibliotecas:**

class-transformer, class-validator: Valida as entradas (body) a partir dos Dto

mockdate: realizar o mock de uma data 

## Database host

PlanetScale

[https://planetscale.com/pricing](https://planetscale.com/pricing)

### Sistema:

Sistema de cardápios.

### **Requisitos:**

Deve conter um cardápio para o dia e um para a noite;

Os produtos devem conter os seguintes campos: preço, nome, imagem, descrição;

Os produtos devem ser organizados por categorias;

Devera haver um CRUD para o cardápio, categoria e produtos;

Cada cardápio pode ter um ou muitos produtos, cada produto pode estar em um ou vários cardápios;

Devera ter um endpoint que retorna um cardápio conforme a hora (6h > diurno < 18h) (18h < noturno < 6h);

Deve haver um endpoint que retorna detalhes de um único produto;

Deve haver endipoint que retorna detalhes de uma única categoria, incluindo seus produtos;

Todos os métodos e classes devem conter no mínimo 3 cases de teste unitário.

### Diagrama de caso de uso:

![Untitled](diagrams/usecase.png)

### Modelagem do Banco de dados:

**Tabela Produto: tb_product**

id_prod

name_prod

price_prod

image_prod

description_prod

id_category_prod

**Tabela Categoria: tb_category**

id_cat

name_cat

description_cat

**Tabela Cardápio: tb_menu**

id_menu

name_menu

time_menu

isActive_menu

**Tabela Cardápio e Produto: tb_menu_product**

id_prod_menuprod

id_menu_menuprod

![Untitled](diagrams/database.png)

### ENV

```bash
NODE_ENV="production"

DATABASE_URL=mysql://f08t72ddp4k1lzy9bort:pscale_pw_F0syahKwnXcixhsxCKpsqXHJ4sgdAp9GIAaq2jtR6sT@aws.connect.psdb.cloud/databaseauchallenge?sslaccept=strict
```

### Docker

build:

```bash
docker build --pull --rm -f "Dockerfile" -t api-challenge-au:latest "."
```

run:

```bash
docker container run --name api-challenge-au -p 80:3000 -d api-challenge-au
```