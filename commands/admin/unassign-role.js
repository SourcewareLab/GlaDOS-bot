import { SlashCommandBuilder } from "discord.js";


export const command = {
    data: new SlashCommandBuilder()
        .setName('unassign')
        .setDescription('unassigns a role to a member')   
        .addRoleOption(option => {
            option.setName('role')
                .setDescription('the role to be unassigned')
                .setRequired(true);
            return option
        })  
       .addUserOption(option => {
           option.setName('user')
           .setDescription('the user who will lose the role')
           .setRequired(true)
        return option
       }),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');

        await interaction.guild.members.removeRole({
            role: role,
            user: user
        });

        await interaction.reply(`User ${user} has been unassigned from the role ${role}.`);
    }
}
