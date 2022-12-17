import Head from "next/head";

import Footer from "./footer";
import Header from "./header";

const LayoutWrapper = (props) => {
  return (
    <div className="mainContainer">
      <Head>
        <title>REP Calc - Leandro Faria</title>
        <meta
          name="description"
          content="Calculadora de horas para uso com relógio eletrônico de ponto"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
