import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { AppClient } from "@/index.js";

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
  async execute(interaction: ChatInputCommandInteraction) {
    //default 10
    const limitOption = interaction.options.getInteger("limit");
    const limit = limitOption ? limitOption : 10;
    const client = interaction.client as Client & AppClient;

    const repository = client.db.userRepository;

    if (!repository) {
      await interaction.reply({
        content: "db not initalised",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const topUsers = await repository.getLeaderboard(limit);

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
