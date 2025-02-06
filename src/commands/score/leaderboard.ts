import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AppChatInputCommandInteraction } from "@/index.js";
import { getLeaderboard } from "@/data/repositories/user.repository.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View server leaderboard")
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("Number of users to show (default: 10, maximum 20)")
        .setMaxValue(20)
        .setRequired(false),
    ),
  async execute(interaction: AppChatInputCommandInteraction) {
    //default 10
    const limitOption = interaction.options.getInteger("limit");
    const limit = limitOption ? limitOption : 10;

    const topUsers = await getLeaderboard(limit);

    const leaderBoardString = topUsers
      .map((user, index) => {
        const userMention = `<@${user.discordId}>`;
        return `${index}. ${userMention} — Score: ${user.score}`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Score Leaderboard")
      .setDescription(leaderBoardString || "No users with score found.")
      .setColor(0x2f3136)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      allowedMentions: { roles: [] },
    });
  },
};
