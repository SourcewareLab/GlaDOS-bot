import { ChatInputCommandInteraction, GuildMember, MessageFlags, PermissionFlagsBits, Role, SlashCommandBuilder, RESTJSONErrorCodes } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Role management') // im open to changing this 
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        // Subcommand for adding a role
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription('Add a role')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('Role to be used') // im open to changing this
                        .setRequired(true)
                )
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('User to add role to') // im open to changing this
                        .setRequired(true)
                )
        )

        // Subcommand for removing a role
        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('Remove a role')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('Role to be used') // im open to changing this
                        .setRequired(true)
                )
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('User to add role to') // im open to changing this
                        .setRequired(true)
                )
        ),
        
    async execute(interaction: ChatInputCommandInteraction) {

        const subCommand: string = interaction.options.getSubcommand()

        switch (subCommand) {
            case 'add':
                add(interaction)
                break;
            case 'remove':
                remove(interaction)
                break;
        }
    }
}


async function add(interaction: ChatInputCommandInteraction) {

    // Check if client has bot scope
    if (!interaction.guild) {
        interaction.reply("Missing 'bot' scope")
            .catch(err => console.error(`Error: Replying to missing bot scope -> ${err}`))
        return
    }

    const role = getRole(interaction)
    const user = getUser(interaction)
    
    // Check if user already has the role
    if (user.roles.cache.has(role.id)) {
        interaction.reply({
            content: `'${user.displayName}' already has '${role.name}'`,
            flags: MessageFlags.Ephemeral
        }).catch(err => console.error(`Error: Replying to user having a role already -> ${err}`))
        return
    }

    // Add the role to the user, then give success message to user
    // If the client adding the role has less permission than the role being added, catch and log the error
    interaction.guild.members.addRole({
        role: role,
        user: user
    }).then(() => {

        console.log(`Log: '${role.name}' role has been added to '${user.displayName}' by ${interaction.user.displayName}`)
        
        interaction.reply({
            content: `'${role.name}' role has been added to '${user.displayName}'`,
            flags: MessageFlags.Ephemeral
        })
    }).catch(async err => {

        console.error(`Error: Adding '${role.name}' role to a member -> ${err}`)
        
        if (err.code === RESTJSONErrorCodes.MissingPermissions) {
            interaction.reply({
                content: `Error: '${role.name}' could not be assigned. Tip: the role might have higher permissions than GlaDOS-bot's role`,
                flags: MessageFlags.Ephemeral
            })
        } else {
            interaction.reply({
                content: `Error: ${err}`,
                flags: MessageFlags.Ephemeral
            })
        }
    })
}

async function remove(interaction: ChatInputCommandInteraction) {

    // Check if client has bot scope
    if (!interaction.guild) {
        interaction.reply("Missing 'bot' scope")
            .catch(err => console.error(`Error: Replying to missing bot scope -> ${err}`))
        return
    }

    const role = getRole(interaction)
    const user = getUser(interaction)

    // Check if user does not have the role already
    if (!user.roles.cache.has(role.id)) {
        interaction.reply({
            content: `'${user.displayName}' does not have '${role.name}'`,
            flags: MessageFlags.Ephemeral
        }).catch(err => console.error(`Error: Replying to user not having a role already -> ${err}`))
        return
    }

    // Remove the role to the user, then give success message to user
    // If the client adding the role has less permission than the role being removed, catch and log the error
    interaction.guild.members.removeRole({
        role: role,
        user: user
    }).then(() => {

        console.log(`Log: '${role.name}' role has been removed from '${user.displayName}' by ${interaction.user.displayName}`)

        interaction.reply({
            content: `'${role.name}' role has been removed from '${user.displayName}'`,
            flags: MessageFlags.Ephemeral
        })
    }).catch(async err => {

        console.error(`Error: Removing '${role.name}' role from member -> ${err}`)

        if (err.code === RESTJSONErrorCodes.MissingPermissions) {
            interaction.reply({
                content: `Error: '${role.name}' could not be removed. Tip: the role might have higher permissions than GlaDOS-bot's role`,
                flags: MessageFlags.Ephemeral
            })    
        } else {
            interaction.reply({
                content: `Error: ${err}`,
                flags: MessageFlags.Ephemeral
            })
        }
    })
}


function getRole(interaction: ChatInputCommandInteraction): Role{
    return interaction.options.getRole('role') as Role;
}


function getUser(interaction: ChatInputCommandInteraction): GuildMember {
    return interaction.options.getMember('user') as GuildMember;
}