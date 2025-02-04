import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;
    const member = await interaction.guild?.members.fetch(user.id);

    // Handling the case where the user is not found and const user is null
    if (!member) {
      await interaction.reply("User Not Found");
      return
    }

    // Getting the Account Created Date and Server Joined Date respectively
    const createdAt = user.createdAt;
    const serverJoined = member.joinedAt;

    // Handling if Server is not joined or a different error occurs
    if (!serverJoined) {
      await interaction.reply("Could not find user Data")
      return
    }

    //Formatting the Date Difference into y years m months d days
    const DiscordFormattedTime = getDateDifferenceFormatted(createdAt);
    const ServerFormattedTime = getDateDifferenceFormatted(serverJoined)

    // Getting All Roles assigned to the user
    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild?.id) // Exclude @everyone
      .map(role => role.name)
      .join(', ') || 'No roles';

    // Writing the Final Replu
    await interaction.reply(`
This command was run by ${interaction.user.username}
Joined Discord: ${createdAt.toDateString()} ~ ${DiscordFormattedTime}
Joined Server: ${serverJoined.toDateString()} ~ ${ServerFormattedTime}
Roles: ${roles}      
`);
  }
}

function getDateDifferenceFormatted(createdAt: Date): string {
  // Getting When User Joined Discord
  const discordYear = createdAt.getFullYear();
  const discordMonth = createdAt.getMonth();
  const discordDay = createdAt.getDay();

  //Getting Current Date
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDay()

  // The Date Difference
  let years = currentYear - discordYear
  let months = currentMonth - discordMonth
  let days = currentDay - discordDay

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

  return `${years} years ${months} months ${days} days`
}
