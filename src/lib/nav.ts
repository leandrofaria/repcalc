export type NavItem = {
  href: string;
  label: string;
  /** Short form for the bottom bar, where four labels share the width. */
  shortLabel: string;
};

/**
 * The four tool screens.
 *
 * The home is deliberately absent: it is reached by the app's name in the
 * header, not by the bar. A bar entry for it would mean two controls for the
 * same destination, one of them on the destination itself.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/jornada", label: "Jornada", shortLabel: "Jornada" },
  { href: "/calculadora", label: "Calculadora", shortLabel: "Calc" },
  { href: "/tempo-total", label: "Tempo Total", shortLabel: "Total" },
  { href: "/sobre", label: "Sobre", shortLabel: "Sobre" },
];

export function isActive(item: NavItem, pathname: string): boolean {
  return pathname.startsWith(item.href);
}
