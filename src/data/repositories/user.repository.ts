import {User} from "discord.js";
import UserModel from "@/data/models/user.model.js";

export const addScoreToUser = async (user: User, point: number) => {

    const [userModel] = await UserModel.upsert({
        discordId: user.id,
        username: user.username
    })

    await userModel.increment("score", {by: point});

}

export const getLeaderboard = async (limit: number): Promise<UserModel[]> => {
    return await UserModel.findAll({
        order: [['score', 'DESC']],
        limit,
    });
}

export const getUserScore = async (user: User) => {
    return await UserModel.upsert({
        discordId: user.id,
        username: user.username,
        score: 0
    });
}