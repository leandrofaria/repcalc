"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "./NavIcon";
import { NAV_ITEMS, isActive } from "@/lib/nav";

/**
 * Navigation from the small breakpoint up: the row of buttons above the
 * content. On a phone this renders nothing and BottomBar takes over, because
 * a row of four labels does not survive a 375px width.
 */
const TopNav = () => {
  const pathname = usePathname();

  return (
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
  );
};

export default TopNav;
