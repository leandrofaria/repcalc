import "./globals.css";
import Image from "next/image";
import FeatureContainer from "@/components/layout/featureContainer";
import Link from "next/link";

const NotFound = () => {
  return (
    <main>
      <FeatureContainer>
        <h2>Erro 404 - Página não encontrada</h2>
        <p>A página que você está tentando acessar não existe.</p>
        <br />
        <Link href="/">
          <div className="centered">
            <Image
              src={`/img/home.png`}
              width={64}
              height={64}
              alt="Página Principal"
            />
            <br />
            <span>Página inicial</span>
          </div>
        </Link>
      </FeatureContainer>
    </main>
  );
};

export default NotFound;
