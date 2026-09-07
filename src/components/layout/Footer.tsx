/**
 * The credit line, at the foot of every screen that has room for one.
 *
 * On a phone the tool screens end in the fixed navigation bar, and a footer
 * behind it would be unreadable — globals.css hides it there. The home has no
 * bar, so it keeps the footer at every width. The rule keys off the bar being
 * on screen rather than off the route, so the two cannot drift apart.
 */
const Footer = () => {
  return (
    <footer className="z-40 flex min-h-[40px] flex-row items-center justify-center border-t border-hairline bg-brand px-4 text-sm text-on-brand dark:border-hairline dark:bg-surface dark:text-ink-muted">
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
