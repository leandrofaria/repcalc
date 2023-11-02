import ContentContainer from "@/components/layout/ContentContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <ContentContainer>
      <SectionTitle>Erro 404 - Página não encontrada</SectionTitle>
      <p>A página que você está tentando acessar não existe.</p>
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

export default NotFound;
