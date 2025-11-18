import { Table, Column, Model, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import Project from "../models/Project.model";
import ProjectUser from "../models/ProjectUser.model";

@Table({
  tableName: "users",
  timestamps: true,
})

export default class User extends Model {
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

  @BelongsToMany(() => Project, () => ProjectUser)
  projects!: Project[];
}
