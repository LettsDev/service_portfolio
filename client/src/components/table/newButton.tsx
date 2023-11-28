import { Link } from "react-router-dom";
export default function NewButton({
  isDisabled,
  tooltipText,
}: {
  isDisabled: boolean;
  tooltipText: string;
}) {
  return (
    <>
      {isDisabled ? (
        <button type="button" className="btn btn-primary text-xl" disabled>
          +
        </button>
      ) : (
        <div
          data-tip={tooltipText}
          className="tooltip tooltip-right sm:tooltip-left tooltip-primary"
        >
          <Link className="btn text-xl btn-primary" to="new">
            +
          </Link>
        </div>
      )}
    </>
  );
}
