import {
  Table,
  Column,
  Model,
  ForeignKey,
  Index
} from "sequelize-typescript";

import User from "./User.model";
import Project from "./Project.model";

@Table({
  tableName: "project_users",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["userId", "projectId"],
    },
    {
      fields: ["userId"],
    },
    {
      fields: ["projectId"],
    },
  ],
})

export default class ProjectUser extends Model<ProjectUser> {
  @ForeignKey(() => User)
  @Column
  @Index("idx_user")
  userId!: number;

  @ForeignKey(() => Project)
  @Column
  @Index("idx_project")
  projectId!: number;
}
