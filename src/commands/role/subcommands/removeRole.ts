import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  RESTJSONErrorCodes,
  Role,
} from "discord.js";

export async function removeRole(interaction: ChatInputCommandInteraction) {
  // Check if client has bot scope
  if (!interaction.guild) {
    interaction
      .reply("Missing 'bot' scope")
      .catch((err) =>
        console.error(`Error: Replying to missing bot scope -> ${err}`),
      );
    return;
  }

  const role = interaction.options.getRole("role") as Role;
  const user = interaction.options.getMember("user") as GuildMember;

  // Check if user does not have the role already
  if (!user.roles.cache.has(role.id)) {
    interaction
      .reply({
        content: `'${user.displayName}' does not have '${role.name}'`,
        flags: MessageFlags.Ephemeral,
      })
      .catch((err) =>
        console.error(
          `Error: Replying to user not having a role already -> ${err}`,
        ),
      );
    return;
  }

  // Remove the role to the user, then give success message to user
  // If the client adding the role has less permission than the role being removed, catch and log the error
  interaction.guild.members
    .removeRole({
      role: role,
      user: user,
    })
    .then(() => {
      console.log(
        `Log: '${role.name}' role has been removed from '${user.displayName}' by ${interaction.user.displayName}`,
      );

      interaction.reply({
        content: `'${role.name}' role has been removed from '${user.displayName}'`,
        flags: MessageFlags.Ephemeral,
      });
    })
    .catch(async (err) => {
      console.error(
        `Error: Removing '${role.name}' role from member -> ${err}`,
      );

      if (err.code === RESTJSONErrorCodes.MissingPermissions) {
        interaction.reply({
          content: `Error: '${role.name}' could not be removed. Tip: the role might have higher permissions than GlaDOS-bot's role`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        interaction.reply({
          content: `Error: ${err}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    });
}
