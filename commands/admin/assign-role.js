import { SlashCommandBuilder } from "discord.js";


export const command = {
    data: new SlashCommandBuilder()
        .setName('assign')
        .setDescription('assigns a role to a member')   
        .addRoleOption(option => {
            option.setName('role')
                .setDescription('the role to be assigned')
                .setRequired(true);
            return option
        })  
       .addUserOption(option => {
           option.setName('user')
           .setDescription('the user whom the role will be assigned')
           .setRequired(true)
        return option
       }),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');

        await interaction.guild.members.addRole({
            role: role,
            user: user
        });

        await interaction.reply(`User ${user} has been assigned the role ${role}.`);
    }
}
