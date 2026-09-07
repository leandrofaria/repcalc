import Image from "next/image";
import ScreenDiagnostics from "./sobre/ScreenDiagnostics";
import ContentContainer from "./layout/ContentContainer";

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="w-full rounded-[12px] border border-hairline bg-surface p-5">
    <h2 className="mb-3 font-display text-base font-bold">{title}</h2>
    {children}
  </section>
);

const LINK_CLASS = "font-semibold text-brand hover:underline";

/**
 * The tech badges are served from public/img/badges rather than fetched from
 * shields.io on every page view: one fewer third-party origin, no layout
 * shift, and they keep working offline.
 */
const TECHNOLOGIES = [
  { file: "next", alt: "Next.js", href: "https://nextjs.org/", width: 78 },
  { file: "react", alt: "React", href: "https://react.dev/", width: 87 },
  {
    file: "typescript",
    alt: "TypeScript",
    href: "https://www.typescriptlang.org/",
    width: 127,
  },
  {
    file: "tailwind",
    alt: "Tailwind CSS",
    href: "https://tailwindcss.com/",
    width: 139,
  },
  { file: "mui", alt: "MUI", href: "https://mui.com/", width: 71 },
  { file: "node", alt: "Node.js", href: "https://nodejs.org/", width: 101 },
] as const;

const Sobre = () => {
  return (
    <ContentContainer>
      <h1 className="sr-only">Sobre o REP Calc</h1>

      <Card title="Sobre o REP Calc">
        <p className="text-ink-muted">
          Desenvolvido por{" "}
          <a
            href="https://www.leandrofaria.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            Leandro Faria
          </a>
          , foi criado por hobby, para uso pessoal e controle das horas
          trabalhadas quando do uso de relógio eletrônico de ponto (REP). A
          primeira versão do sistema era baseada em linha de comando e evoluiu
          para uma versão web a fim de facilitar o uso em diferentes
          dispositivos. Para maiores informações, contato ou código fonte da
          aplicação, visite o{" "}
          <a
            href="https://www.linkedin.com/in/farialaf/"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            LinkedIn
          </a>{" "}
          e/ou o{" "}
          <a
            href="https://github.com/leandrofaria/repcalc"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            GitHub
          </a>{" "}
          do autor.
        </p>
      </Card>

      <Card title="Tecnologias">
        <ul className="flex w-full list-none flex-row flex-wrap items-center justify-center gap-3 p-0">
          {TECHNOLOGIES.map((tech) => (
            <li key={tech.file}>
              <a
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tech.alt}
              >
                <Image
                  src={`/img/badges/${tech.file}.svg`}
                  alt={tech.alt}
                  width={tech.width}
                  height={28}
                  unoptimized
                />
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Hospedagem e infraestrutura">
        <div className="flex w-full flex-col items-center justify-center sm:flex-row">
          {/* Affiliate banners, which have to be served from the advertiser's
            own host, so next/image is not appropriate here. */}
          {/* eslint-disable @next/next/no-img-element */}
          <a
            href="https://www.interserver.net/r/480102"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="hidden sm:inline-block"
          >
            <img
              src="https://www.interserver.net/logos/12946839.gif"
              alt="InterServer"
              width={728}
              height={90}
              className="h-auto max-w-full"
            />
          </a>
          <a
            href="https://www.interserver.net/r/480102"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block sm:hidden"
          >
            <img
              src="https://www.interserver.net/logos/12946831.gif"
              alt="InterServer"
              width={250}
              height={250}
              className="h-auto max-w-full"
            />
          </a>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </Card>

      <ScreenDiagnostics />
    </ContentContainer>
  );
};

export default Sobre;
