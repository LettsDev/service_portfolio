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
        <button
          type="button"
          className="btn db-primary text-xl text-white"
          disabled
        >
          +
        </button>
      ) : (
        <div
          data-tip={tooltipText}
          className="tooltip tooltip-left tooltip-primary"
        >
          <Link className="btn text-xl btn-primary text-white" to="new">
            +
          </Link>
        </div>
      )}
    </>
  );
}
