"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "./NavIcon";
import { NAV_ITEMS, isActive } from "@/lib/nav";

/**
 * Navigation, in the place each screen size expects it.
 *
 * On a phone it is a fixed bottom bar within reach of the thumb, with labels
 * always visible — the old bar sat at the top and dropped its labels below
 * 640px, leaving five illustrations with nothing to say what they did. From
 * the small breakpoint up it becomes the row of buttons above the content.
 */
const TopNav = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Phone: fixed to the bottom edge. */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
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

      {/* Small and up: the familiar row above the content. */}
      <nav
        aria-label="Navegação principal"
        className="page-container mb-4 hidden w-full grid-cols-4 gap-2 sm:grid"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              variant={active ? "contained" : "outlined"}
              color="primary"
              aria-current={active ? "page" : undefined}
              startIcon={<NavIcon href={item.href} />}
              sx={{
                minWidth: 0,
                fontSize: "14px",
                backgroundColor: active ? "primary.main" : "background.paper",
                borderColor: "divider",
                color: active ? "primary.contrastText" : "text.primary",
                "&:hover": {
                  backgroundColor: active ? "primary.dark" : "background.paper",
                  borderColor: "primary.main",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </nav>
    </>
  );
};

export default TopNav;
