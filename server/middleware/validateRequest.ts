import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (e: any) {
      console.log(e);
      return res.status(400).send(e.errors);
    }
  };
export default validate;
