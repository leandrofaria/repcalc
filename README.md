<h1 align="center">
  <br>
  <img src="https://repcalc.leandrofaria.com/img/calc.png" alt="REP Calc" width="64">
  <br>
  REP Calc
  <br>
</h1>

<h4 align="center">Uma calculadora de horas (e algumas funções a mais) para uso com relógio eletrônico de ponto.</h4>
<h4 align="center">Online em <a href="https://repcalc.leandrofaria.com">https://repcalc.leandrofaria.com</a></h4>
<h4 align="center">Imagem para contêiner disponível em <a href="https://hub.docker.com/r/farialaf/repcalc">https://hub.docker.com/r/farialaf/repcalc</a></h4>

<br>

<p align="center">
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"
         alt="React">
  </a>
  <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  </a>
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#como-rodar">Como Rodar</a> •
  <a href="#créditos">Créditos</a> •
  <a href="#licença">Licença</a>
</p>

## Funcionalidades

- Calculadora básica e de tempo (horas e minutos)
- Planejamento da jornada de trabalho
- Cálculo de tempo entre marcações de ponto

## Como Rodar

A aplicação encontra-se online e disponível no endereço:

[REP Calc (https://repcalc.leandrofaria.com)](https://repcalc.leandrofaria.com)

Para clonar e rodar esta aplicação localmente você precisará do [Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/download/) (que vem com o [npm](http://npmjs.com)) instalados em sua máquina. Da sua linha de comando:

```bash
# Faça um clone deste repositório
$ git clone https://github.com/leandrofaria/repcalc

# Entre no repositório
$ cd repcalc

# Instale as dependências
$ npm install

# Rode o app (em modo de desenvolvimento)
$ npm run dev

# Para rodar em modo de produção primeiro faça a build
$ npm run build

# Depois inicie o app
$ npm start
```

A aplicação ficará disponível no endereço: http://localhost:3000

Observações:

- A porta patrão de execução da aplicação é a 3000

- O analytics (Google Analytics) inicia desativado por padrão. Para ativá-lo, crie o arquivo .env.local com o seguinte par chave/valor: NEXT_PUBLIC_GA_ID=\<sua chave do Google Analytics\>

## Créditos

Esta aplicação utiliza as seguintes bibliotecas/frameworks e dependências.

- [Node.js](https://nodejs.org/)
- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/)
- Ícones por Icons8 (https://icons8.com/)

## Licença

MIT

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
