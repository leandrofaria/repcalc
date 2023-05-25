"use client";

import Link from "next/link";
import styles from "./topNav.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

const TopNav = (props) => {
  const pathname = usePathname();

  return (
    <nav className={styles.topNav}>
      <div>
        <Link
          href="/"
          className={pathname.startsWith("/home") ? styles.active : ""}
        >
          <Image
            src={`/img/home.png`}
            alt="Página Principal"
            height={36}
            width={36}
          />
          <span>Home</span>
        </Link>
      </div>
      <div>
        <Link
          href="/calculadora"
          className={pathname.startsWith("/calculadora") ? styles.active : ""}
        >
          <Image
            src={`/img/calc.png`}
            alt="Calculadora"
            height={36}
            width={36}
          />
          <span>Calculadora</span>
        </Link>
      </div>
      <div>
        <Link
          href="/jornada"
          className={pathname.startsWith("/jornada") ? styles.active : ""}
        >
          <Image src={`/img/stats.png`} alt="Jornada" height={36} width={36} />
          <span>Jornada</span>
        </Link>
      </div>
      <div>
        <Link
          href="/tempo-total"
          className={pathname.startsWith("/tempo-total") ? styles.active : ""}
        >
          <Image
            src={`/img/steps.png`}
            alt="Tempo Total"
            height={36}
            width={36}
          />
          <span>Tempo Total</span>
        </Link>
      </div>
      <div>
        <Link
          href="/sobre"
          className={pathname.startsWith("/sobre") ? styles.active : ""}
        >
          <Image src={`/img/about.png`} alt="Sobre" height={36} width={36} />
          <span>Sobre</span>
        </Link>
      </div>
    </nav>
  );
};

export default TopNav;
