import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionsBitField,
  Role,
} from "discord.js";

export async function addRoleAll(interaction: ChatInputCommandInteraction) {
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

  const role = interaction.options.getRole("assign_role") as Role;

  // if role has admin permission
  if (
    ((role.permissions.valueOf() as bigint) &
      PermissionsBitField.Flags.Administrator) ===
    PermissionsBitField.Flags.Administrator
  ) {
    await interaction
      .editReply({
        content: `The role provided is an Administrator Role. please provide a different role.`,
      })
      .catch((err) =>
        console.log(`error replying to admin role manipulation -> ${err}`),
      );
    return;
  }

  try {
    await interaction.editReply({
      content: `Assigning role @${role.name} , please wait...`,
    });
  } catch (err) {
    console.log(`error replying to replace starting message -> ${err}`);
    return;
  }

  (await interaction.guild.members.fetch()).values().forEach(async (member) => {
    // if member is an admin or member is a bot or a member has the role
    if (
      ((member.permissions.valueOf() as bigint) &
        PermissionsBitField.Flags.Administrator) ===
        PermissionsBitField.Flags.Administrator ||
      member.user.bot ||
      member.roles.cache.hasAny(role.id)
    ) {
      return;
    }
    await member.roles.add(role);
  });

  await interaction.editReply({
    content: `Successfully assigned role @${role.name} from all users.`,
  });
}
