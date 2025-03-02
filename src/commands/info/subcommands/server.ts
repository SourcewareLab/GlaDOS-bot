import { ChatInputCommandInteraction } from "discord.js";

export async function printServerInfo(
  interaction: ChatInputCommandInteraction,
) {
  if (!interaction.guild) {
    await interaction.reply("Something went wrong");
  } else {
    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  }
}
