import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

import User from "../models/User.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import ProjectUser from "../models/ProjectUser.model";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test.local" : ".env",
});

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  logging: true,

  dialectOptions: {
    ssl: false,
    connectTimeout: 60000,
  },

  models: [User, Project, Task, ProjectUser],
});

export default sequelize;
