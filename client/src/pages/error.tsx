import { useRouteError } from "react-router-dom";
import { ExtendedError } from "../types";

export default function ErrorPage() {
  const error = useRouteError() as ExtendedError;
  return (
    <>
      <p>The following Error occurred:</p>
      <p>{error.message}</p>
      <p>{error.statusCode}</p>
    </>
  );
}
