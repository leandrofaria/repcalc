import styles from "./sobre.module.css";

export const metadata = {
  title: "REP Calc v2 - Sobre",
};

const SobrePage = () => {
  return (
    <>
      <h2>Sobre o REP Calc</h2>
      <p>
        Desenvolvido por{" "}
        <a href="http://www.leandrofaria.com" target="_blank">
          Leandro Faria
        </a>
        , foi criado por hobby, para uso pessoal e controle das horas
        trabalhadas quando do uso de relógio eletrônico de ponto (REP). A
        primeira versão do sistema era baseada em linha de comando e evoluiu
        para uma versão web para facilitar o uso em diferentes dispositivos.
        Para maiores informações, contato ou código fonte da aplicação, visite o{" "}
        <a href="https://www.linkedin.com/in/farialaf/" target="_blank">
          LinkedIn
        </a>{" "}
        e/ou o{" "}
        <a href="https://github.com/leandrofaria" target="_blank">
          GitHub
        </a>{" "}
        do autor.
      </p>
      <br />
      <h2>Tecnologias</h2>
      <div className={`centered ${styles.badges}`}>
        <a href="https://reactjs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
            height="39px"
            alt="ReactJS"
          />
        </a>
        <a href="https://nextjs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"
            height="39px"
            alt="NextJS"
          />
        </a>
        <a href="https://nodejs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"
            height="39px"
            alt="NodeJS"
          />
        </a>
      </div>
      <br />
      <h2>Hospedagem e Infraestrutura</h2>
      <br />
      <div className="centered desktopOnly">
        <a href="https://www.interserver.net/r/480102" target="_blank">
          <img
            src="https://www.interserver.net/logos/12946839.gif"
            alt="InterServer"
          />
        </a>
      </div>
      <div className="centered mobileOnly">
        <a href="https://www.interserver.net/r/480102" target="_blank">
          <img
            src="https://www.interserver.net/logos/12946831.gif"
            alt="InterServer"
          />
        </a>
      </div>
    </>
  );
};

export default SobrePage;
