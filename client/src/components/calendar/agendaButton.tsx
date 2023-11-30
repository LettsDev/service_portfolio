import { Link } from "react-router-dom";
interface ILink {
  text: string;
  isPrimary: boolean;
  to: string;
  type: "link";
}
interface IButton {
  text: string;
  type: "button";
}
type PropType = ILink | IButton;

export default function AgendaButton(props: PropType) {
  if (props.type === "link") {
    return (
      <Link
        to={props.to}
        className={`btn ${props.isPrimary ? "btn-primary" : "btn-secondary"}`}
      >
        {props.text}
      </Link>
    );
  }
  return (
    <button type="button" disabled className={`btn`}>
      {props.text}
    </button>
  );
}
