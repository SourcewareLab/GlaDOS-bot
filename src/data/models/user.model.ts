import { Model, DataTypes, CreationOptional } from "sequelize";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Sequelize } from "sequelize";

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare discordId: string;
  declare username: string;
  declare score: CreationOptional<number>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

export const initUserModel = (sequelize: Sequelize) => {
  UserModel.init(
    {
      discordId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "users",
      sequelize,
    },
  );

  return UserModel;
};

export default UserModel;
