import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { registerModels } from "../models";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: (process.env.DB_DIALECT as any) || "mysql",
  logging: true,

  dialectOptions: {
    ssl: false,
    connectTimeout: 60000,
  },

});

registerModels(sequelize);

export default sequelize;
