const Footer = () => {
  return (
    <footer className="z-40 hidden min-h-[40px] flex-row items-center justify-center border-t border-hairline bg-brand px-4 text-sm text-on-brand sm:flex dark:border-hairline dark:bg-surface dark:text-ink-muted">
      <a
        href="https://www.leandrofaria.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:underline"
      >
        Desenvolvido por Leandro Faria
      </a>
    </footer>
  );
};

export default Footer;
