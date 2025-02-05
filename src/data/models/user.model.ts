import {Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt} from "sequelize-typescript";


@Table({
    tableName: "users",
    modelName: "user",
})
class UserModel extends Model<UserModel> {
    @Column
    username!: string;

    @Column
    score!: number;

    @CreatedAt
    @Column
    creationDate!: Date;

    @UpdatedAt
    @Column
    updatedOn!: Date;

    @DeletedAt
    @Column
    deletionDate?: Date;
}