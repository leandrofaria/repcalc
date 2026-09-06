export type NavItem = {
  href: string;
  label: string;
  icon: string;
  /** Home only matches its own route; the others match their subtrees. */
  exact?: boolean;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", icon: "/img/home.webp", exact: true },
  { href: "/calculadora", label: "Calculadora", icon: "/img/calculadora.webp" },
  { href: "/jornada", label: "Jornada", icon: "/img/jornada.webp" },
  { href: "/tempo-total", label: "Tempo Total", icon: "/img/tempototal.webp" },
  { href: "/sobre", label: "Sobre", icon: "/img/sobre.webp" },
];

export function isActive(item: NavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
