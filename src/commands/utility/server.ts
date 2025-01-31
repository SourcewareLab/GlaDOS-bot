import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`);
    }

}