import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),

    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.reply(`This command was run by ${interaction.user.username}`);
    }
}