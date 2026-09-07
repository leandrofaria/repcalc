import Link from "next/link";
import NavIcon from "../layout/NavIcon";

/**
 * One entry on the home.
 *
 * The icon comes from the same map the navigation uses, keyed by route, so a
 * screen cannot end up with one icon in the menu and another in the bar.
 */
const MenuCard = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="flex min-h-[152px] flex-col justify-between rounded-[12px] border border-hairline bg-surface p-5 transition-colors hover:border-brand focus-visible:border-brand"
  >
    <div className="flex flex-row items-start gap-4">
      <span className="shrink-0 rounded-[9px] bg-ok-bg p-2 text-brand">
        <NavIcon href={href} fontSize="large" />
      </span>
      <div className="min-w-0">
        <h3 className="mb-1 font-display text-lg font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </div>
    <span className="mt-4 self-end text-sm font-semibold text-brand">
      Acessar &rarr;
    </span>
  </Link>
);

export default MenuCard;
