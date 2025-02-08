import { ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';


export const command = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Provides time related commands to the user.'),

  async execute(interaction: ChatInputCommandInteraction) {
    // Ensure the command is executed in a guild
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const Description = "Performs Time related opertations."

    const embed = new EmbedBuilder()
      .setTitle(`Time Conversion`)
      .setDescription(Description || "No Data Found")
      .setColor(0x2f3136)

    // Reply with the embed and the interactive select menu
    await interaction.reply({
      embeds: [embed],
      allowedMentions: { roles: [] }, // This prevents role pings
    });
  }
}
