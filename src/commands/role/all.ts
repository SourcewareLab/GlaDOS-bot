import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
  Guild,
  Role,
  PermissionFlagsBits,
  GuildMember,
  RESTJSONErrorCodes,
  PermissionsBitField,
} from "discord.js";

enum Subcommand {
  Replace = "replace",
  Assign = "assign",
  Unassign = "unassign",
}

//TODO: Add checking for Admin Role

export const command = {
  data: new SlashCommandBuilder()
    .setName("all")
    .setDescription("assigns or unassigns a role from everyone in the  server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    //subcommand for assigning a role to all members that have the newcomer role only or no role at all.
    .addSubcommand((subcommand) =>
      subcommand
        .setName("assign")
        .setDescription(
          "assign all users that dont have a role or only have the newcomer role with a given role.",
        )
        .addRoleOption((option) =>
          option
            .setName("assign_role")
            .setDescription(
              "the role that should be added to all normal users.",
            )
            .setRequired(true),
        ),
    )

    //subcommand for unassigning a role to all members that have that role.
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unassign")
        .setDescription("unassign a role from all users that have it.")
        .addRoleOption((option) =>
          option
            .setName("unassign_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true),
        ),
    )

    //subcommand for replacing a role from all members that have that role.
    .addSubcommand((subcommand) =>
      subcommand
        .setName("replace")
        .setDescription(
          "replace a role with another for all users that have it.",
        )
        .addRoleOption((option) =>
          option
            .setName("remove_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("replace_role")
            .setDescription("the role that should be replaced on all users.")
            .setRequired(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    // Ensure the command is executed in a guild
    if (!guild) {
      await interaction.editReply({
        content: "This command can only be used within a server.",
      });
      return;
    }

    //Ensures bot has MANAGE_ROLES permission
    if (!(guild.members.me as GuildMember).permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      await interaction.reply({
        content: "missing bot permission for Managing Roles.",
        flags: MessageFlags.Ephemeral,
      }).catch(err => console.log(`error replying to missing bot permission -> ${err}`));

      return
    }

    const roleID = process.env.ADMIN_ROLE_ID;
    if (!roleID) {
      await interaction.reply({
        content: "missing environment variable for admin role.",
        flags: MessageFlags.Ephemeral,
      }).catch(err => console.log(`error replying to missing env vars -> ${err}`));

      return;
    }

    const adminRole = guild.roles.cache.get(roleID)
    if (!adminRole) {
      await interaction.reply({
        content: "invalid value of ADMIN_ROLE_ID env var.",
        flags: MessageFlags.Ephemeral,
      }).catch(err => console.log(`error replying to invalid env vars -> ${err}`));

      return;
    }

    const subCommand = interaction.options.getSubcommand();

    //ensures that all member details are cached
    await interaction.guild.members.fetch();

    switch (subCommand) {
      case "assign":
        assign(interaction, guild, adminRole);
        break;
      case "unassign":
        unassign(interaction, guild, adminRole);
        break;
      case "replace":
        replace(interaction, guild, adminRole);
        break;
      default:
        await interaction.reply({
          content: "Invalid subcommand.",
          flags: MessageFlags.Ephemeral,
        });
        return;
    }
  },
};

async function replace(interaction: ChatInputCommandInteraction, guild: Guild, adminRole: Role) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const removeRole = getRole(interaction, "remove_role");
  const replaceRole = getRole(interaction, "replace_role");

  await interaction
    .editReply({
      content: `Replacing role @${removeRole.name} with @${replaceRole.name}, please wait...`,
    })
    .catch(err => console.log(`error replying to replace starting message -> ${err}`))

  const promiseQueue: Promise<[GuildMember, GuildMember]>[] = [];

  guild.members.cache.values()
    .forEach(async (member) => {
      if (
        !(member.roles.cache.some((role) => role.name === removeRole.name || role.name === adminRole.name)) //checks if the user has some role
      ) {
        return
      }

      const memberReplace = Promise.all([member.roles.remove(removeRole), member.roles.add(replaceRole)]) //adds a role to a user and removes previous ones
        .catch(async (err) => {
          catchError(err, interaction, Subcommand.Replace, member)
        })

      promiseQueue.push(memberReplace as Promise<[GuildMember, GuildMember]>); //ensure only non-void promises are evaluated
    });

  evalPromiseArr(interaction, promiseQueue, `Successfully replaced role @${removeRole.name} to role @${replaceRole.name}.`)
}


async function assign(interaction: ChatInputCommandInteraction, guild: Guild, adminRole: Role) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const role = getRole(interaction, "assign_role");

  await interaction
    .editReply({
      content: `Assigning role @${role.name} , please wait...`,
    })
    .catch(err => console.log(`error replying to replace starting message -> ${err}`))

  const promiseQueue: Promise<GuildMember>[] = [];

  guild.members.cache.values()
    .forEach(async (member) => {
      if (member.roles.cache.some((currRole) => currRole.name === adminRole.name)) { //checks if the user has some role
        return
      }

      const memberAssign = member.roles.add(role) //adds a role to a user and removes previous ones
        .catch(async (err) => {
          catchError(err, interaction, Subcommand.Assign, member)
        })

      promiseQueue.push(memberAssign as Promise<GuildMember>); //ensure only non-void promises are evaluated
    });

  evalPromiseArr(interaction, promiseQueue, `Successfully assigned role @${role.name} to all users.`)
}

async function unassign(interaction: ChatInputCommandInteraction, guild: Guild, adminRole: Role) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  const role = getRole(interaction, "unassign_role");

  await interaction
    .editReply({
      content: `Unassigning role @${role.name} , please wait...`,
    })
    .catch(err => console.log(`error replying to replace starting message -> ${err}`))

  const promiseQueue: Promise<GuildMember>[] = [];

  guild.members.cache.values()
    .forEach(async (member) => {
      if (
        (!(member.roles.cache.some((currRole) => currRole.name === role.name))
          || member.roles.cache.some((currRole) => currRole.name === adminRole.name))
      ) { //checks if the user has some role
        return
      }

      const memberAssign = member.roles.remove(role) //removes a role from a user 
        .catch(async (err) => {
          catchError(err, interaction, Subcommand.Unassign, member)
        })

      promiseQueue.push(memberAssign as Promise<GuildMember>); //ensure only non-void promises are evaluated
    });

  evalPromiseArr(interaction, promiseQueue, `Successfully unassigned role @${role.name} from all users.`)
}

async function catchError(err: unknown, interaction: ChatInputCommandInteraction, subcommand: Subcommand, member: GuildMember) {
  console.log(`ERROR: /all command\nmember: ${member}\n${err}`);
  if (err === RESTJSONErrorCodes.MissingPermissions) {
    await interaction
      .editReply({
        content: "Missing Permissions on bot."
      })
      .catch(err => console.log(`error replying to missing permissions exception -> ${err}`))

    return
  }

  await interaction.editReply({
    content: `Error ${subcommand}ing role for a member`
  })
    .catch(err => console.log(`error replying to ${subcommand} exception -> ${err}`))
}

function evalPromiseArr(interaction: ChatInputCommandInteraction, promiseQueue: Promise<GuildMember | [GuildMember, GuildMember]>[], replyContent: string) {
  Promise.all(promiseQueue)
    .then(async () => {
      await interaction
        .followUp({
          content: replyContent,
          flags: MessageFlags.Ephemeral
        })
        .catch((err) => {
          console.log(`Error replying to command success -> ${err} `);

        })
    })
    .catch(async (err) => {
      console.log(`ERROR: /all command \n${err}`);

      await interaction.editReply({
        content: "Error replacing role for a member"
      })
        .catch(err => console.log(`error replying to replace exception -> ${err}`))
    })
}

function getRole(interaction: ChatInputCommandInteraction, role: string) {
  return interaction.options.getRole(role) as Role
}

