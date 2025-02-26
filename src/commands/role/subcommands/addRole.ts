import { ChatInputCommandInteraction, GuildMember, MessageFlags, RESTJSONErrorCodes, Role } from "discord.js";


export async function addRole(interaction: ChatInputCommandInteraction) {
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

  // Check if user already has the role
  if (user.roles.cache.has(role.id)) {
    interaction
      .reply({
        content: `'${user.displayName}' already has '${role.name}'`,
        flags: MessageFlags.Ephemeral,
      })
      .catch((err) =>
        console.error(
          `Error: Replying to user having a role already -> ${err}`,
        ),
      );
    return;
  }

  // Add the role to the user, then give success message to user
  // If the client adding the role has less permission than the role being added, catch and log the error
  interaction.guild.members
    .addRole({
      role: role,
      user: user,
    })
    .then(() => {
      console.log(
        `Log: '${role.name}' role has been added to '${user.displayName}' by ${interaction.user.displayName}`,
      );

      interaction.reply({
        content: `'${role.name}' role has been added to '${user.displayName}'`,
        flags: MessageFlags.Ephemeral,
      });
    })
    .catch(async (err) => {
      console.error(`Error: Adding '${role.name}' role to a member -> ${err}`);

      if (err.code === RESTJSONErrorCodes.MissingPermissions) {
        interaction.reply({
          content: `Error: '${role.name}' could not be assigned. Tip: the role might have higher permissions than GlaDOS-bot's role`,
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