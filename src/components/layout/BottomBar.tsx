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
 * The room for the phone's gesture area is added in globals.css, and only
 * when the app owns the whole screen — see the note there.
 */
const BottomBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      data-bottom-bar
      className="grid shrink-0 grid-cols-4 border-t border-hairline bg-surface sm:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              active
                ? "text-brand shadow-[inset_0_2px_0_var(--rc-brand)]"
                : "text-ink-faint"
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
