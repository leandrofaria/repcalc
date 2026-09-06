import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeRegistry/ThemeToggle";
import { APP_VERSION } from "@/lib/version";

const Header = () => {
  return (
    <header className="z-50">
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar variant="dense" className="gap-2">
          <Link
            href="/"
            className="grow font-display text-xl font-bold tracking-tight"
          >
            REP Calc
          </Link>
          <ThemeToggle />
          <Link
            href="/sobre"
            className="tabular text-sm font-semibold opacity-90"
            aria-label={`Versão ${APP_VERSION}, sobre o sistema`}
          >
            v{APP_VERSION}
          </Link>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
