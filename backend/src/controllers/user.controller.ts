import { Request, Response } from "express";
import User from "../models/User.model";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email"],
  });
  return res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  return res.status(200).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  await user.update(req.body);

  res.status(200).json({ message: "Usuario actualizado", user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  await user.destroy();

  return res.status(204).json({ message: "Usuario eliminado" });
};
