import { Sequelize } from "sequelize-typescript";
import Project from "./Project.model";
import Task from "./Task.model";
import User from "./User.model";
import ProjectUser from "./ProjectUser.model";

export function registerModels(sequelize: Sequelize) {
  sequelize.addModels([Project, Task, User, ProjectUser]);
}

export { Project, Task, User, ProjectUser };
