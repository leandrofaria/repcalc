import Image from "next/image";
import Link from "next/link";
import classes from "../../styles/menuCard.module.css";

const MenuCard = (props) => {
  return (
    <Link href={props.target}>
      <div className={classes.card}>
        <Image src={props.icon} height={60} width={60} alt={props.title} />
        <strong>{props.title}</strong>
        <p>{props.description}</p>
      </div>
    </Link>
  );
};

export default MenuCard;
