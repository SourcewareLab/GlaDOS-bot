import {
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.")
    .setContexts(InteractionContextType.Guild),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply("Something went wrong");
    } else {
      await interaction.reply(
        `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
      );
    }
  },
};
