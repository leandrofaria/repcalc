import styles from "./calcButton.module.css";

const CalcButton = (props) => {
  return (
    <div
      className={`${styles.calcButton} ${props.className} ${
        styles[props["type"]]
      } ${props.disabled ? styles.disabled : ""}`}
      onClick={!props.disabled ? props.onClick : () => {}}
    >
      {props.value}
    </div>
  );
};

export default CalcButton;
