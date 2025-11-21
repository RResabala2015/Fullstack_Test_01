import { Request, Response } from "express";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    } as any);

    return res.status(201).json({ message: "Usuario registrado", user });
  } catch (error) {
    return res.status(500).json({ error: "Error en el registro" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    return res.status(500).json({ error: "Error en el login" });
  }
};
