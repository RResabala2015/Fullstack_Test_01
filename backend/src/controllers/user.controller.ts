import { Request, Response } from "express";
import User from "../models/User.model";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "createdAt"],
  });
  return res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  return res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  await user.update(req.body);

  res.json({ message: "Usuario actualizado", user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  await user.destroy();

  res.json({ message: "Usuario eliminado" });
};
