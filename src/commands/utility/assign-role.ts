import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";


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
       })
       .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        // Get the user input
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');

        // Role and user are required options, thus they should never be null
        if (!role || !user) {
            throw new Error(`Input was falsy`);
        }
        // Ensure the command is called in a guild
        if (!interaction.guild) {
            await interaction.reply(`This command can only be used within a server.`);
            return;
        }

        // role can be an APIRole, I don't know when it is and when it isn't. This is a workaround.
        const guildRole = await interaction.guild.roles.cache.get(role.id);
        if (!guildRole) {
            await interaction.reply(`The given role doesn't exist.`); 
            return;
        }

        await interaction.guild.members.addRole({
            role: guildRole,
            user: user
        });

        await interaction.reply(`User ${user} has been assigned from the role ${role}.`);
    }

}
