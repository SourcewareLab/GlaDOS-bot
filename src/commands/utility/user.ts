import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

//TODO: Score?
//TODO: Description?

export const command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The username to search for")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Ensure the command is executed in a guild
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const user = interaction.options.getUser("user") ?? interaction.user;

    if (!user) {
      await interaction.reply("User Not Found");
      return;
    }

    //Finding User in Guild Members
    const member = await interaction.guild?.members.fetch(user.id);

    // Handling the case where the user is not found and const user is null
    if (!member) {
      await interaction.reply("User Not Found");
      return;
    }

    // Getting the Account Created Date and Server Joined Date respectively
    const createdAt = user.createdAt;
    const serverJoined = member.joinedAt;

    // Handling if Server is not joined or a different error occurs
    if (!serverJoined) {
      await interaction.reply("Could not find user Data");
      return;
    }

    //Formatting the Date Difference into y years m months d days
    const DiscordFormattedTime = getDateDifferenceFormatted(createdAt);
    const ServerFormattedTime = getDateDifferenceFormatted(serverJoined);

    //Getting User Avater
    const avatar = user.displayAvatarURL();

    // Get all roles (excluding the @everyone role)
    const roles = member.roles.cache.filter(
      (role) => role.name !== "@everyone",
    );

    // Build a display string for the embed.
    const roleList = roles
      .map((role) => {
        const roleMention = `<@&${role.id}>`;
        return `${roleMention}`;
      })
      .join(" ");

    const Description = `
      
      **Joined Discord**: ${createdAt.toDateString()} ~ ${DiscordFormattedTime}

      **Joined Server**: ${serverJoined.toDateString()} ~ ${ServerFormattedTime}

      **Roles**: ${roleList}\n\n`.trimStart();

    const embed = new EmbedBuilder()
      .setTitle(`${member.displayName}`)
      .setDescription(Description || "No Data Found")
      .setThumbnail(avatar)
      .setColor(0x2f3136); // Neutral embed color; individual role colors will show in the mentions.

    // Reply with the embed and the interactive select menu
    await interaction.reply({
      embeds: [embed],
      allowedMentions: { roles: [] }, // This prevents role pings
    });
  },
};

function getDateDifferenceFormatted(createdAt: Date): string {
  // Getting When User Joined Discord
  const discordYear = createdAt.getFullYear();
  const discordMonth = createdAt.getMonth();
  const discordDay = createdAt.getDay();

  //Getting Current Date
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDay();

  // The Date Difference
  let years = currentYear - discordYear;
  let months = currentMonth - discordMonth;
  let days = currentDay - discordDay;

  // Handling Negative Dates
  if (days < 0) {
    months--;
    const lastMonth = new Date(currentYear, currentMonth, 0).getDate();
    days += lastMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years ${months} months ${days} days`;
}
