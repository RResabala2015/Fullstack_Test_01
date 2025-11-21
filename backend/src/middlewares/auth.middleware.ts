import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { id: number };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};