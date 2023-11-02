"use client";

import ContentContainer from "@/components/layout/ContentContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Image from "next/image";
import Link from "next/link";

const Error = () => {
  return (
    <ContentContainer>
      <SectionTitle>Erro</SectionTitle>
      <p>
        Não foi possível processar sua requisição no momento. Tente novamente
        mais tarde.
      </p>
      <div className="mx-auto mt-12">
        <Link href="/" className="flex flex-col justify-center items-center">
          <Image
            src={"/img/home.webp"}
            alt="Página Inicial"
            width={60}
            height={60}
          />
          <p className="font-semibold text-[#1976D2]">Página Inicial</p>
        </Link>
      </div>
    </ContentContainer>
  );
};

export default Error;
