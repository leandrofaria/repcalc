import ContentContainer from "./layout/ContentContainer";
import SectionTitle from "./ui/SectionTitle";

const Sobre = () => {
  return (
    <ContentContainer>
      <SectionTitle>Sobre o REP Calc</SectionTitle>
      <p className="text-justify">
        Desenvolvido por{" "}
        <a
          href="http://www.leandrofaria.com/"
          target="_blank"
          className="font-semibold text-[#1976D2]"
        >
          Leandro Faria
        </a>
        , foi criado por hobby, para uso pessoal e controle das horas
        trabalhadas quando do uso de relógio eletrônico de ponto (REP). A
        primeira versão do sistema era baseada em linha de comando e evoluiu
        para uma versão web a fim de facilitar o uso em diferentes dispositivos.
        Para maiores informações, contato ou código fonte da aplicação, visite o{" "}
        <a
          href="https://www.linkedin.com/in/farialaf/"
          target="_blank"
          className="font-semibold text-[#1976D2]"
        >
          LinkedIn
        </a>{" "}
        e/ou o{" "}
        <a
          href="https://github.com/leandrofaria"
          target="_blank"
          className="font-semibold text-[#1976D2]"
        >
          GitHub
        </a>{" "}
        do autor.
      </p>
      <br className="my-6" />
      <SectionTitle>Tecnologias</SectionTitle>
      <div className="w-full flex flex-col sm:flex-row justify-center items-center">
        <a href="https://nextjs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/Next-%23333333?style=for-the-badge&logo=next.js&logoColor=#FFFFFF"
            alt="NextJS"
            className="h-[39px] m-3"
          />
        </a>
        <a href="https://tailwindcss.com/" target="_blank">
          <img
            src="https://img.shields.io/badge/tailwindcss-%23333333.svg?style=flat-square&logo=tailwindcss&logoColor=#61DAFB"
            alt="TailwindCSS"
            className="h-[39px] m-3"
          />
        </a>
        <a href="https://mui.com/" target="_blank">
          <img
            src="https://img.shields.io/badge/mui-%23333333.svg?style=flat-square&logo=mui&logoColor=#003FFF"
            alt="MaterialUI"
            className="h-[39px] m-3"
          />
        </a>
        <a href="https://nodejs.org/" target="_blank">
          <img
            src="https://img.shields.io/badge/node.js-%23333333?style=for-the-badge&logo=node.js&logoColor=#19d241"
            alt="NodeJS"
            className="h-[39px] m-3"
          />
        </a>
      </div>
      <br className="my-6" />
      <SectionTitle>Hospedagem e Infraestrutura</SectionTitle>
      <div className="w-full flex flex-col sm:flex-row justify-center items-center">
        <a
          href="https://www.interserver.net/r/480102"
          target="_blank"
          className="hidden sm:inline-block"
        >
          <img
            src="https://www.interserver.net/logos/12946839.gif"
            alt="InterServer"
          />
        </a>
        <a
          href="https://www.interserver.net/r/480102"
          target="_blank"
          className="inline-block sm:hidden"
        >
          <img
            src="https://www.interserver.net/logos/12946831.gif"
            alt="InterServer"
          />
        </a>
      </div>
    </ContentContainer>
  );
};

export default Sobre;
