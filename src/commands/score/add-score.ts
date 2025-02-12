import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { AppChatInputCommandInteraction } from '@/index.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('give-score')
    .setDescription('Add score to a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to add score to')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Amount to add (default: 1)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async function(interaction: AppChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    const pointInput = interaction.options.getInteger('amount');
    const point = pointInput ? pointInput : 1;

    if (point < 1) {
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: 'You can\'t add minus points this way!'
      });
      return;
    }

    if (!user) {
      await interaction.reply({
        content: 'An error has occurred',
        flags: MessageFlags.Ephemeral
      });
      return;
    }


    const repository = interaction.client.db.userRepository;

    if (!repository) {
      await interaction.reply({ content: 'db not initalised', flags: MessageFlags.Ephemeral });
      return;
    }
    await repository.addScoreToUser(user, point);

    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      content: `added ${point} to user <@${user.id}>`
    });
  }
};
