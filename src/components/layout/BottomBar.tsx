"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "./NavIcon";
import { NAV_ITEMS, isActive } from "@/lib/nav";

/**
 * Navigation on a phone: a bar at the bottom, within reach of the thumb.
 *
 * Deliberately **not** `position: fixed`. A fixed bottom bar is placed against
 * the layout viewport, which on a phone is not the visible one while the
 * browser's address bar is collapsing: on Firefox for Android the bar drifted
 * out of view entirely, came back on scroll, and left the spacing above it
 * changing as it went. It is a normal element at the end of the app shell's
 * column instead, so the browser has nothing to reconcile — it is simply the
 * last thing in a box the height of the screen.
 *
 * Being in the flow also means it takes real space, so no screen has to guess
 * a bottom padding to clear it. The previous guess was 76px against a bar that
 * is 57px in a browser tab and taller than that in an installed app.
 *
 * It carries the header's colour rather than the page's. In dark mode MUI
 * paints the header with the surface, which is what this bar was already
 * using, so the two matched by accident; in light mode one was brand and the
 * other white. Brand on both closes the frame at the same colour it opens.
 */
const BottomBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      data-bottom-bar
      className="grid h-[var(--rc-bottom-bar)] shrink-0 grid-cols-4 bg-brand sm:hidden dark:border-t dark:border-hairline dark:bg-surface"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              active
                ? "text-on-brand shadow-[inset_0_3px_0_var(--rc-on-brand)] dark:text-brand dark:shadow-[inset_0_3px_0_var(--rc-brand)]"
                : "text-on-brand/70 dark:text-ink-faint"
            }`}
          >
            <NavIcon href={item.href} fontSize="medium" />
            {item.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomBar;
