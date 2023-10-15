import { Link } from "react-router-dom";
export default function TableRowButtons({ id }: { id: string }) {
  return (
    <div className="join join-vertical lg:join-horizontal ">
      <Link
        to={`edit/${id}`}
        className="btn join-item bg-primary hover:bg-primary-focus text-white border-none"
      >
        Edit
      </Link>
      <Link
        to={`delete/${id}`}
        className="btn join-item bg-secondary hover:bg-secondary-focus border-none text-white"
      >
        Delete
      </Link>
    </div>
  );
}
