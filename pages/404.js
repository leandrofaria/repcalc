import Link from "next/link";
import Head from "next/head";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>REP Calc - Página Não Encontrada - Leandro Faria</title>
      </Head>
      <main>
        <div className="contentContainer">
          <div className="breadcrumbs">
            <span>
              <Link href="/">Home</Link> &rarr; Erro 404
            </span>
          </div>
          <div className="feature">
            <h3>Página Não Encontrada</h3>
            <p>A página que você está tentando acessar não existe.</p>
            <br />
            <br />
            <Link href="/">
              <p>Clique aqui para retornar a página inicial.</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
