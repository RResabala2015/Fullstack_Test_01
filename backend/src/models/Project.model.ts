import { Table, Column, Model, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import Task from "../models/Task.model";
import User from "../models/User.model";
import ProjectUser from "../models/ProjectUser.model";

@Table({
  tableName: "projects",
  timestamps: true,
})

export default class Project extends Model {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @HasMany(() => Task)
  tasks!: Task[];

  @BelongsToMany(() => User, () => ProjectUser)
  users!: User[];
}
