import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionsBitField,
  Role,
} from "discord.js";

export async function replaceRoleAll(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral,
  });

  if (!interaction.guild) {
    interaction
      .reply("Missing 'bot' scope")
      .catch((err) =>
        console.error(`Error: Replying to missing bot scope -> ${err}`),
      );
    return;
  }

  const roleToAdd = interaction.options.getRole("add_role") as Role;
  const roleToRemove = interaction.options.getRole("remove_role") as Role;

  // if one or both roles have admin permission
  if (
    ((roleToAdd.permissions.valueOf() as bigint) &
      PermissionsBitField.Flags.Administrator) ===
      PermissionsBitField.Flags.Administrator ||
    ((roleToRemove.permissions.valueOf() as bigint) &
      PermissionsBitField.Flags.Administrator) ===
      PermissionsBitField.Flags.Administrator
  ) {
    await interaction
      .editReply({
        content: `One of the roles provided is an Administrator Role. please provide different roles.`,
      })
      .catch((err) =>
        console.log(`error replying to admin role manipulation -> ${err}`),
      );
    return;
  }

  try {
    await interaction.editReply({
      content: `Replacing role @${roleToRemove.name} with @${roleToAdd.name}, please wait...`,
    });
  } catch (err) {
    console.log(`error replying to replace starting message -> ${err}`);
    return;
  }

  (await interaction.guild.members.fetch()).values().forEach(async (member) => {
    // if member is an admin or member is a bot or member has the role to add already or member doesnt have the role to remove
    if (
      ((member.permissions.valueOf() as bigint) &
        PermissionsBitField.Flags.Administrator) ===
        PermissionsBitField.Flags.Administrator ||
      member.user.bot ||
      member.roles.cache.hasAny(roleToAdd.id) ||
      !member.roles.cache.hasAny(roleToRemove.id)
    ) {
      return;
    }
    await member.roles.remove(roleToRemove);
    await member.roles.add(roleToAdd);
  });

  await interaction.editReply({
    content: `Successfully replaced role @${roleToRemove.name} to role @${roleToAdd.name} from all users.`,
  });
}
