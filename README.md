<h1 align="center">
  <br>
  <img src="https://repcalc.leandrofaria.com/img/calculadora.webp" alt="REP Calc" width="64">
  <br>
  REP Calc
  <br>
</h1>

<h4 align="center">An hours calculator (and a few things beyond that) for people who clock in and out on an electronic time clock.</h4>
<h4 align="center">Live at <a href="https://repcalc.leandrofaria.com">https://repcalc.leandrofaria.com</a></h4>
<h4 align="center">Container image at <a href="https://hub.docker.com/r/farialaf/repcalc">https://hub.docker.com/r/farialaf/repcalc</a></h4>

<br>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next-%23333333?style=for-the-badge&logo=next.js&logoColor=#FFFFFF" alt="NextJS" height="30px" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/tailwindcss-%23333333.svg?style=flat-square&logo=tailwindcss&logoColor=#61DAFB" alt="TailwindCSS" height="30px" /></a>
  <a href="https://mui.com/" target="_blank"><img src="https://img.shields.io/badge/mui-%23333333.svg?style=flat-square&logo=mui&logoColor=#003FFF" alt="MaterialUI" height="30px" /></a>
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/node.js-%23333333?style=for-the-badge&logo=node.js&logoColor=#19d241" alt="NodeJS" height="30px" /></a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#running-it">Running it</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Features

- A calculator for plain numbers and for time (hours and minutes)
- Planning a working day: entry, exit and break times
- Elapsed time between two punches

## Running it

The app is already online at:

[REP Calc (https://repcalc.leandrofaria.com)](https://repcalc.leandrofaria.com)

To clone and run it locally you need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) and [npm](http://npmjs.com) installed. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/leandrofaria/repcalc

# Enter the repository
$ cd repcalc

# Install the dependencies
$ npm install

# Run the app (in development mode)
$ npm run dev

# For production mode, build it first
$ npm run build

# Then start the app
$ npm start
```

The app will be available at http://localhost:3000

Notes:

- The app runs on port 3000 by default

- Analytics (Google Analytics) starts disabled. To turn it on, create a `.env.local` file with the following key/value pair: `NEXT_PUBLIC_GA_ID=<your Google Analytics key>`

## Credits

This app uses the following libraries, frameworks and dependencies.

- [NextJS](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)
- Icons by Icons8 (https://icons8.com/)

## License

MIT

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
