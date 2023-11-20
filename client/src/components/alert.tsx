import { AlertType } from "../types";
import { useEffect } from "react";
import { useAlert } from "../context/alert.provider";
export default function AlertComponent({ alert }: { alert: AlertType }) {
  const { removeAlert } = useAlert();
  // const [alertProgress, setAlertProgress] = useState(0);
  const createdTime = Date.now();
  const duration =
    typeof alert.duration === "undefined" ? 5000 : alert.duration * 1000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const delta = currentTime - createdTime;
      if (delta > duration) {
        removeAlert(alert.id!);
        clearInterval(intervalId);
      }
      // setAlertProgress((delta / duration) * 100);
      //had issue with a progress bar being shown on the alert. As daisyUI is being used it seems to only make allotment for a set configuration
    }, 50);
  }, []);

  switch (alert.type) {
    case "error":
      return (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {/* <progress
            className="progress progress-error"
            max="100"
            value={alertProgress}
          ></progress> */}
          <span>{alert.error}</span>
        </div>
      );
    case "success":
      return (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          {/* <progress
            className="progress progress-success"
            max="100"
            value={alertProgress}
          ></progress> */}
          <span>{alert.message}</span>
        </div>
      );
    case "warning":
      return (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <span>{alert.message}</span>
        </div>
      );
  }
}
