import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";

const Header = () => {
  return (
    <header className="z-50">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <div className="grow text-2xl font-semibold">
              <Link href="/">
                <h1>REP Calc</h1>
              </Link>
            </div>
            <div>
              <Link href="/sobre" className="font-semibold text-base">
                <h2>v3.3.2</h2>
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default Header;
