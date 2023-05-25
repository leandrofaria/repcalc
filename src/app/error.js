"use client";

import "./globals.css";
import Image from "next/image";
import FeatureContainer from "@/components/layout/featureContainer";
import Link from "next/link";

const Error = ({ error, reset }) => {
  return (
    <main>
      <FeatureContainer>
        <h2>Erro</h2>
        <p>Algo inesperado aconteceu.</p>
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

export default Error;
