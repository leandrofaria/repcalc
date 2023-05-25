import Link from "next/link";
import styles from "./card.module.css";

import Image from "next/image";

const Card = (props) => {
  return (
    <Link href={`/${props.target}`} className={styles.card}>
      <Image
        src={`/img/${props.icon}.png`}
        width={64}
        height={64}
        alt={props.title}
      />
      <p className={styles.cardTitle}>{props.title}</p>
      <p>{props.description}</p>
    </Link>
  );
};

export default Card;
