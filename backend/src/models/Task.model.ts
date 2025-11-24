import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Project from "./Project.model";
import User from "./User.model";

@Table({
  tableName: "tasks",
  timestamps: true,
  indexes: [
    { fields: ["projectId"] },
    { fields: ["assignedTo"] },
    { fields: ["status"] },
    { fields: ["priority"] },
    { fields: ["projectId", "status"] },
  ],
})
export default class Task extends Model {
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM("pending", "inProgress", "completed"),
    defaultValue: "pending",
  })
  status!: "pending" | "inProgress" | "completed";

  @Column({
    type: DataType.ENUM("low", "mid", "high"),
    defaultValue: "mid",
  })
  priority!: "low" | "mid" | "high";

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;

  @ForeignKey(() => User)
  @Column
  assignedTo?: number;

  @BelongsTo(() => User)
  assignedUser?: User;
}
