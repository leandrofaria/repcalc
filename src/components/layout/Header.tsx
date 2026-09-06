import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { APP_VERSION } from "@/lib/version";

const Header = () => {
  return (
    <header className="z-50">
      <AppBar position="static">
        <Toolbar>
          <div className="grow text-2xl font-semibold">
            <Link href="/">REP Calc</Link>
          </div>
          <Link
            href="/sobre"
            className="font-semibold text-base"
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
