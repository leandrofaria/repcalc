import Link from "next/link";
import classes from "../styles/sobre.module.css";

const Sobre = () => {
  return (
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; Sobre o REP Calc
          </span>
        </div>
        <div className={classes.aboutContainer}>
          <span>
            Desenvolvido por{" "}
            <a href="https://www.leandrofaria.com" target="_blank">
              Leandro Faria
            </a>
            , foi criado por hobby, para uso pessoal e controle das horas
            trabalhadas quando do uso de relógio eletrônico de ponto (REP). A
            primeira versão do sistema era baseada em linha de comando e evoluiu
            para uma versão web para facilitar o uso em diferentes dispositivos.
            O código da aplicação encontra-se disponível em{" "}
            <a href="https://github.com/leandrofaria/repcalc" target="_blank">
              https://github.com/leandrofaria/repcalc
            </a>
            .
          </span>
          <p>Para maiores informações e contato, seguem links do dev:</p>
          <div className={classes.techDisplay}>
            <a href="https://github.com/leandrofaria" target="_blank">
              <strong>GitHub</strong>
            </a>
            <a href="https://www.linkedin.com/in/farialaf/" target="_blank">
              <strong>LinkedIn</strong>
            </a>
          </div>

          <p>
            <strong>Tecnologias:</strong>
          </p>
          <hr />
          <div className={classes.techDisplay}>
            <a href="https://reactjs.org/" target="_blank">
              <div>
                <p>
                  <strong>React</strong>
                </p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/270px-React-icon.svg.png"
                  alt="React"
                />
              </div>
            </a>
            <a href="https://nextjs.org/" target="_blank">
              <div>
                <p>
                  <strong>NextJS</strong>
                </p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/207px-Nextjs-logo.svg.png"
                  alt="NextJS"
                />
              </div>
            </a>
            <a href="https://nodejs.org/" target="_blank">
              <div>
                <p>
                  <strong>NodeJS</strong>
                </p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/320px-Node.js_logo.svg.png"
                  alt="NodeJS"
                />
              </div>
            </a>
          </div>
          <p>
            <strong>Hospedagem e Infraestrutura:</strong>
          </p>
          <hr />
          <div className={classes.infraDisplay}>
            <a href="https://www.interserver.net/r/480102" target="_blank">
              <div>
                <p>
                  <strong>InterServer</strong>
                </p>
                <img
                  src="https://www.interserver.net/logos/12946819.gif"
                  alt="InterServer"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sobre;
