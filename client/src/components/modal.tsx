import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  showModal: boolean;
  children: React.ReactNode;
}

export default function Modal({ showModal, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (showModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [showModal]);

  function handleClose() {
    //navigate back
    navigate(-1);
  }
  return (
    <dialog
      ref={ref}
      className="modal max-w-sm sm:max-w-none"
      onCancel={handleClose}
    >
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        {children}
      </div>

      <form method="dialog" className="modal-backdrop">
        {/* close modal on click off */}
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
