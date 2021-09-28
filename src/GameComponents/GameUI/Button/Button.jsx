import "./ButtonStyle.css";

export default function Button({ children, classes, ...props }) {
  return (
    <button className={`game-button ${classes}`} {...props}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  classes: "",
};
