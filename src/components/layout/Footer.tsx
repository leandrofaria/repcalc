/**
 * The credit line, at the foot of every screen that has room for one.
 *
 * On a phone the tool screens end in the navigation bar and this is hidden,
 * by a rule in globals.css that keys off the bar being present rather than
 * off the route, so the two cannot drift apart. The home has no bar, so it
 * keeps the footer at every width.
 *
 * Installed, whichever of the two is the foot of the shell also reserves the
 * phone's gesture area, so its own colour fills that strip instead of the
 * page's canvas showing through beneath it.
 */
const Footer = () => {
  return (
    <footer className="z-40 flex flex-row items-stretch justify-center border-t border-hairline bg-brand px-4 text-sm text-on-brand dark:border-hairline dark:bg-surface dark:text-ink-muted">
      <a
        href="https://www.leandrofaria.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[40px] items-center font-medium hover:underline"
      >
        Desenvolvido por Leandro Faria
      </a>
    </footer>
  );
};

export default Footer;
