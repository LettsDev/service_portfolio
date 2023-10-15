import { Request, Response } from "express";
import { ExtendedError } from "../types";
export default function handleErrors(
  error: Error,
  req: Request,
  res: Response
) {
  if (error instanceof ExtendedError) {
    return res.send(error.message).status(error.statusCode!);
  }
}
