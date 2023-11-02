<h1 align="center">
  <br>
  <img src="https://repcalc.leandrofaria.com/img/calculadora.webp" alt="REP Calc" width="64">
  <br>
  REP Calc
  <br>
</h1>

<h4 align="center">Uma calculadora de horas (e algumas funções a mais) para uso com relógio eletrônico de ponto.</h4>
<h4 align="center">Online em <a href="https://repcalc.leandrofaria.com">https://repcalc.leandrofaria.com</a></h4>
<h4 align="center">Imagem para contêiner disponível em <a href="https://hub.docker.com/r/farialaf/repcalc">https://hub.docker.com/r/farialaf/repcalc</a></h4>

<br>

<p align="center">
  <a href="https://nextjs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/Next-%23333333?style=for-the-badge&logo=next.js&logoColor=#FFFFFF"
            alt="NextJS"
            height="30px"
          />
        </a>
        <a href="https://tailwindcss.com/" target="_blank">
          <img
            src="https://img.shields.io/badge/tailwindcss-%23333333.svg?style=flat-square&logo=tailwindcss&logoColor=#61DAFB"
            alt="TailwindCSS"
            height="30px"
          />
        </a>
        <a href="https://mui.com/" target="_blank">
          <img
            src="https://img.shields.io/badge/mui-%23333333.svg?style=flat-square&logo=mui&logoColor=#003FFF"
            alt="MaterialUI"
            height="30px"
          />
        </a>
        <a href="https://nodejs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/node.js-%23333333?style=for-the-badge&logo=node.js&logoColor=#19d241"
            alt="NodeJS"
            height="30px"
          />
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

Para clonar e rodar esta aplicação localmente você precisará do [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) e [npm](http://npmjs.com) instalados em sua máquina. Da sua linha de comando:

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

- [NextJS](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)
- Ícones por Icons8 (https://icons8.com/)

## Licença

MIT

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
