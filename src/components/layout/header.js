import Link from "next/link";
import styles from "./header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1>REP Calc v2</h1>
      </Link>
    </header>
  );
};

export default Header;
