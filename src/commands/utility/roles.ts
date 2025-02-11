import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  PermissionsBitField,
  Role
} from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Provides a list of roles for the server."),

  async execute(interaction: ChatInputCommandInteraction) {
    // Ensure the command is executed in a guild
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Get all roles (excluding the @everyone role)
    const roles = interaction.guild.roles.cache
      .filter((role) => role.id !== interaction.guild!.id)
      // Optionally, sort roles by member count (descending)
      .sort((a, b) => getHeirarchy(b) - getHeirarchy(a));

    // Build a display string for the embed.
    const roleList = roles
      .map((role) => {
        const roleMention = `<@&${role.id}>`;
        return `${roleMention} — Members: \`${role.members.size}\``;
      })
      .join("\n");

    // Create an embed "card" with the list of roles.
    const embed = new EmbedBuilder()
      .setTitle("Server Roles")
      .setDescription(roleList || "No roles found.")
      .setColor(0x2f3136) // Neutral embed color; individual role colors will show in the mentions.
      .setTimestamp();

    // Reply with the embed and the interactive select menu
    await interaction.reply({
      embeds: [embed],
      allowedMentions: { roles: [] }, // This prevents role pings
    });
  },
};

function getHeirarchy(role: Role) {
  if (role.permissions.has(PermissionsBitField.Flags.Administrator)) return 100;
  if (role.permissions.has(PermissionsBitField.Flags.ManageGuild)) return 80;
  if (role.permissions.has(PermissionsBitField.Flags.ManageRoles)) return 70;
  if (role.permissions.has(PermissionsBitField.Flags.KickMembers)) return 60;
  if (role.permissions.has(PermissionsBitField.Flags.BanMembers)) return 50;
  if (role.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return 40;
  if (role.permissions.has(PermissionsBitField.Flags.ManageMessages)) return 30;
  return 0; // Regular roles
};
