import { 
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import Task from "./Task.model";
import User from "./User.model";
import ProjectUser from "./ProjectUser.model";

@Table({
  tableName: "projects",
  timestamps: true,
  indexes: [
    { fields: ["ownerId"] },
    { fields: ["name"] },
    { fields: ["ownerId", "name"] },
  ],
})
export default class Project extends Model<Project> {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId!: number;

  @BelongsTo(() => User, { as: "owner" })
  owner!: User;

  @HasMany(() => Task)
  tasks!: Task[];

  @BelongsToMany(() => User, () => ProjectUser)
  collaborators!: User[];
}
