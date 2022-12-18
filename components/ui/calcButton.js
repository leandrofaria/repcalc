import classes from "../../styles/calcButton.module.css";

const CalcButton = (props) => {
  return (
    <button
      type="button"
      className={`${classes.calcButton} ${
        props.styling !== "" ? classes[props.styling] : ""
      }`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

export default CalcButton;
