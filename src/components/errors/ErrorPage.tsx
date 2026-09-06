import ContentContainer from "@/components/layout/ContentContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Image from "next/image";
import Link from "next/link";

/** Shared body for the error and not-found pages, which were near-identical. */
const ErrorPage = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => (
  <ContentContainer>
    <SectionTitle>{title}</SectionTitle>
    <p>{message}</p>
    {action}
    <div className="mx-auto mt-12">
      <Link href="/" className="flex flex-col justify-center items-center">
        <Image src="/img/home.webp" alt="" width={60} height={60} />
        <span className="font-semibold text-[#1976D2]">Página Inicial</span>
      </Link>
    </div>
  </ContentContainer>
);

export default ErrorPage;
