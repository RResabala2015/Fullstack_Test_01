import { type ZodSchema } from "zod";
import { type Request, type Response, type NextFunction } from "express";

const validate = (schema: ZodSchema) => (
  req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error: any) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors,
    });
  }
};

export default validate;