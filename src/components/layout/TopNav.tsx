"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "@/lib/nav";

const TopNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="page-container mb-4 grid w-full grid-cols-5 gap-2"
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
            className="flex flex-row items-center justify-center"
            sx={{
              minWidth: 0,
              paddingInline: "8px",
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
            <Image src={item.icon} alt="" width={22} height={22} />
            <span className="ml-2 hidden whitespace-nowrap sm:inline-block">
              {item.label}
            </span>
          </Button>
        );
      })}
    </nav>
  );
};

export default TopNav;
