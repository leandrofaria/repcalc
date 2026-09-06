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
      className="container mx-auto min-h-[45px] mb-[12px] grid grid-flow-row grid-cols-5 gap-3"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname);
        return (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            variant="outlined"
            size="large"
            aria-current={active ? "page" : undefined}
            className="flex flex-row justify-center items-center shadow-sm"
            sx={{
              minWidth: 0,
              paddingInline: "9px",
              fontSize: "15px",
              fontWeight: "bold",
              textTransform: "capitalize",
              backgroundColor: active ? "primary.main" : "#FFFFFF",
              color: active ? "primary.contrastText" : "primary.main",
              "&:hover": {
                backgroundColor: active ? "primary.main" : "inherit",
              },
            }}
          >
            <Image src={item.icon} alt="" width={24} height={24} />
            <span className="ml-3 hidden sm:inline-block whitespace-nowrap">
              {item.label}
            </span>
          </Button>
        );
      })}
    </nav>
  );
};

export default TopNav;
