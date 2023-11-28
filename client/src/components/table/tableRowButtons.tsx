import { Link } from "react-router-dom";

type props = {
  id: string;
  editDisabled: boolean;
  deleteDisabled: boolean;
};

export default function TableRowButtons({
  id,
  editDisabled,
  deleteDisabled,
}: props) {
  return (
    <div className="join join-vertical lg:join-horizontal ">
      {editDisabled ? (
        <button type="button" disabled className="btn btn-primary join-item ">
          Edit
        </button>
      ) : (
        <Link to={`edit/${id}`} className="btn join-item btn-primary  ">
          Edit
        </Link>
      )}
      {deleteDisabled ? (
        <button type="button" disabled className="btn btn-primary join-item ">
          Delete
        </button>
      ) : (
        <Link to={`delete/${id}`} className="btn join-item btn-secondary ">
          Delete
        </Link>
      )}
    </div>
  );
}
