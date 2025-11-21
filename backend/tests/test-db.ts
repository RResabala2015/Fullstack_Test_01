import { Sequelize } from "sequelize-typescript";
import { registerModels } from "../src/models";

export const sequelizeTest = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

registerModels(sequelizeTest);

export default sequelizeTest;
