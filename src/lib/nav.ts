export type NavItem = {
  href: string;
  label: string;
  /** Short form for the bottom bar, where five labels share the width. */
  shortLabel: string;
};

/**
 * There is no Home entry any more: with the bar always on screen, a menu of
 * four cards was one tap between the user and the tool. "/" goes straight to
 * Jornada, which is the screen people open every day.
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
