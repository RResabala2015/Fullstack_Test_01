import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import User from "../models/User.model";
import Project from "../models/Project.model";

@Table({
  tableName: "project_users",
  timestamps: false,
})

export default class ProjectUser extends Model<ProjectUser> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;
}
