import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";

import Project from "./Project.model";

@Table({
  tableName: "users",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["email"] },
    { fields: ["name"] },
    { fields: ["createdAt"] },
  ],
})
export default class User extends Model<User> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @HasMany(() => Project, { as: "ownedProjects", foreignKey: "ownerId" })
  ownedProjects!: Project[];
}
