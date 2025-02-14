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
    .setName("score")
    .setDescription("View score of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to check score")
        .setRequired(false),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const optionsUser = interaction.options.getUser("user");
    const user = optionsUser ? optionsUser : interaction.user;
    const client = interaction.client as Client & AppClient;

    const repository = client.db.userRepository;

    if (!repository) {
      await interaction.reply({
        content: "db not initalised",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const userModel = await repository.getUserScore(user);

    const embed = new EmbedBuilder().setDescription(
      `<@${userModel.discordId}> score is: ${userModel.score}`,
    );

    await interaction.reply({ embeds: [embed] });
  },
};
