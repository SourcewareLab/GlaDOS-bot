import {
    Column,
    CreatedAt,
    Default,
    DeletedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import {InferAttributes, InferCreationAttributes} from "sequelize";


@Table({
    tableName: "users",
    modelName: "user",
})
export default class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>{

    @PrimaryKey
    @Column
    declare discordId: string;

    @Column
    username!: string;

    @Column
    @Default(0)
    score?: number;

    @CreatedAt
    @Column
    creationDate?: Date;

    @UpdatedAt
    @Column
    updatedOn?: Date;

    @DeletedAt
    @Column
    deletionDate?: Date;
}