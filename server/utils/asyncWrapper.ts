import { Request, Response, NextFunction } from "express";

export default function asyncWrapper(
  fn: (req: Request<any>, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
