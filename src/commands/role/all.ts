import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
  Guild,
  Role,
  PermissionFlagsBits,
  GuildMember
} from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('all')
    .setDescription("assigns or unassigns a role from everyone in the  server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    //subcommand for assigning a role to all members that have the newcomer role only or no role at all. 
    .addSubcommand(subcommand =>
      subcommand
        .setName("assign")
        .setDescription("assign all users that dont have a role or only have the newcomer role with a given role.")
        .addRoleOption(option =>
          option.setName("assign_role")
            .setDescription("the role that should be added to all normal users.")
            .setRequired(true)
        )
    )

    //subcommand for unassigning a role to all members that have that role. 
    .addSubcommand(subcommand =>
      subcommand
        .setName("unassign")
        .setDescription("unassign a role from all users that have it.")
        .addRoleOption(option =>
          option.setName("unassign_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true)
        )
    )

    //subcommand for replacing a role from all members that have that role. 
    .addSubcommand(subcommand =>
      subcommand
        .setName("replace")
        .setDescription("replace a role with another for all users that have it.")
        .addRoleOption(option =>
          option.setName("remove_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName("replace_role")
            .setDescription("the role that should be replaced on all users.")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild

    // Ensure the command is executed in a guild
    if (!guild) {
      await interaction.editReply({
        content: "This command can only be used within a server.",
      });
      return;
    }

    const subCommand = interaction.options.getSubcommand()

    //ensures that all member details are cached
    await interaction.guild.members.fetch()

    switch (subCommand) {
      case "assign":
        assign(interaction, guild)
        break;
      case "unassign":
        unassign(interaction, guild)
        break;
      case "replace":
        replace(interaction, guild)
        break;
      default:
        await interaction.reply({
          content: "Invalid subcommand.",
          flags: MessageFlags.Ephemeral
        })
        return
    }

  }
}

async function replace(interaction: ChatInputCommandInteraction, guild: Guild) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })
  const membersArr = Array.from(guild.members.cache.values())

  const removeRole = interaction.options.getRole("remove_role")
  const replaceRole = interaction.options.getRole("replace_role")

  if (!removeRole || !replaceRole || !(replaceRole instanceof Role) || !(removeRole instanceof Role)) { // need to check if role is actually a Role, because  getRole can return Role | APIRole | null
    await interaction.editReply({
      content: `given role is invalid.`,
    })
    return
  }

  const filteredMembers = membersArr.filter(member => member.roles.cache.some(role => role.name === removeRole.name))

  const promiseArr: Promise<GuildMember>[] = [];

  filteredMembers.forEach(member => {
    promiseArr.push(member.roles.remove(removeRole));
    promiseArr.push(member.roles.add(replaceRole))
  })

  await interaction.editReply({
    content: `Replacing role @${removeRole.name} with @${replaceRole.name}...`,
  })
  await Promise.all(promiseArr);

  await interaction.followUp({
    content: `Successfully Replaced role @${removeRole.name} with role ${replaceRole.name} for all users`,
  })
}

async function assign(interaction: ChatInputCommandInteraction, guild: Guild) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })

  const membersArr = Array.from(guild.members.cache.values())

  const role = interaction.options.getRole("assign_role")
  if (!role || !(role instanceof Role)) { // need to check if role is actually a Role, because  getRole can return Role | APIRole | null
    await interaction.editReply({
      content: `given role is invalid.`
    })
    return
  }

  const roleID = process.env.NEWCOMER_ROLE_ID;
  if (!roleID) {
    console.log("missing environment variables");
    return;
  }

  const newcomerRole = guild.roles.cache.get(roleID);
  if (!newcomerRole) {
    await interaction.editReply({
      content: `Could not find newcomer role.`,
    })
    return;
  }

  const filteredMembers = membersArr.filter((member) => {
    const roles = Array.from(member.roles.cache.filter((role) => role.name !== "@everyone").values())

    // checks if no. of roles is 0, if yes moves to block, else checks whether there is one role
    // and its the newcomer role
    return roles.length === 0 || roles.length === 1 && roles[0].name === newcomerRole.name
  })
  const promiseArr: Promise<GuildMember>[] = [];

  filteredMembers.forEach((member) => promiseArr.push(member.roles.add(role)))

  await interaction.editReply({
    content: `Assigning all users with role @${role.name}...`,
  })

  await Promise.all(promiseArr);

  await interaction.followUp({
    content: `Successfully Assigned all users with role @${role.name}`,
    flags: MessageFlags.Ephemeral
  })
}

async function unassign(interaction: ChatInputCommandInteraction, guild: Guild) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })

  const membersArr = Array.from(guild.members.cache.values())

  const role = interaction.options.getRole("unassign_role")
  if (!role || !(role instanceof Role)) { // need to check if role is actually a Role, because  getRole can return Role | APIRole | null
    await interaction.editReply({
      content: `given role is invalid.`,
    })
    return
  }

  const filteredMembers = membersArr.filter((member) => {
    return Array.from(member.roles.cache.values()).filter(currentRole => role === currentRole)
  })

  const promiseArr: Promise<GuildMember>[] = [];

  filteredMembers.forEach((member) => promiseArr.push(member.roles.remove(role)))

  await interaction.editReply({
    content: "Removing the roles please wait..."
  })

  await Promise.all(promiseArr);

  await interaction.followUp({
    content: `Successfully Removed role @${role.name} from all users with the respective role.`,
    flags: MessageFlags.Ephemeral
  })
}

