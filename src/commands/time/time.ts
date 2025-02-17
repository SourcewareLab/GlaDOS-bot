import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
} from 'discord.js';
import { ConvertTime, DayDiff, TimeConverter, TimeResponse } from './modules/time_conversion.js';
import timeZoneData from './modules/timeZoneData.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription("Provides time related commands to the user.")

    //subcommand for converting current time
    .addSubcommand(subcommand =>
      subcommand
        .setName("now")
        .setDescription("converts current time to some Time Zone")
        .addStringOption(option =>
          option
            .setName("time_zone")
            .setDescription("the time zone to show current time for")
            .setRequired(true)
            .addChoices(...timeZoneData.map(tz => ({
              name: tz.name,
              value: tz.name
            })))
        )
    )

    //subcommand for converting time to different time zone
    .addSubcommand(subcommand =>
      subcommand
        .setName("convert")
        .setDescription("converts given time to some Time Zone")
        .addStringOption(option =>
          option.setName("time")
            .setDescription("the time that should be converted in format HH:MM")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("time_zone_given")
            .setDescription("the time zone of the given time.")
            .setRequired(true)
            .addChoices(...timeZoneData.map(tz => ({
              name: tz.name,
              value: tz.name
            })))
        )
        .addStringOption(option =>
          option
            .setName("time_zone_convert")
            .setDescription("the time zone to convert given time to.")
            .setRequired(true)
            .addChoices(...timeZoneData.map(tz => ({
              name: tz.name,
              value: tz.name
            })))
        )
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

    const subCommand = interaction.options.getSubcommand()

    switch (subCommand) {
      case "now":
        now(interaction)
        break;
      case "convert":
        convert(interaction)
        break
      default:
        await interaction.reply({
          content: "Subcommand not found.",
          flags: MessageFlags.Ephemeral
        })
    }
  }
}

async function now(interaction: ChatInputCommandInteraction) {
  const timeZoneVal = interaction.options.getString('time_zone')

  if (!timeZoneVal) {
    await interaction.reply({
      content: "Error parsing time_zone argument.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const timeZone = timeZoneData.filter(tz => {
    return tz.name === timeZoneVal
  })[0]

  if (!timeZone) {
    await interaction.reply({
      content: "Error while matching time zones.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const timeNow = new Date();

  const hours = timeNow.getUTCHours();
  const minutes = timeNow.getUTCMinutes();

  const timeConvertData: TimeConverter = {
    hours: hours,
    minutes: minutes,
    timeZoneGiven: timeZoneData.filter((e) => e.value.name === "GMT")[0],
    timeZoneConvert: timeZone
  }

  const response: TimeResponse = ConvertTime(timeConvertData)

  let dayStr: string;

  if (response.day === DayDiff.NextDay) {
    dayStr = "tomorrow"
  } else if (response.day === DayDiff.PrevDay) {
    dayStr = "yesterday"
  } else {
    dayStr = "today"
  }

  const message = `It is currently ${getFormatted(response.hours)}:${getFormatted(response.minutes)} ${dayStr} in ${timeConvertData.timeZoneConvert.value.name} time zone.`;

  await interaction.reply({
    content: message,
    flags: MessageFlags.Ephemeral
  })
}

async function convert(interaction: ChatInputCommandInteraction) {
  const time = interaction.options.getString('time')
  const timeZoneGivenVal = interaction.options.getString('time_zone_given')
  const timeZoneConvertVal = interaction.options.getString('time_zone_convert')

  if (!timeZoneGivenVal || !time || !timeZoneConvertVal) {
    await interaction.reply({
      content: "Error parsing command argument.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const timeZoneGiven = timeZoneData.filter(tz => {
    return tz.name === timeZoneGivenVal
  })[0]
  const timeZoneConvert = timeZoneData.filter(tz => {
    return tz.name === timeZoneConvertVal
  })[0]

  if (!timeZoneGiven || !timeZoneConvert) {
    await interaction.reply({
      content: "Error while matching time zones.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const [hoursStr, minutesStr] = time.split(":");
  if (!hoursStr || !minutesStr || time.split(":").length > 2) {
    await interaction.reply({
      content: "Invalid time argument format, make sure its in HH:MM format.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const hours = parseInt(hoursStr)
  const minutes = parseInt(minutesStr)
  if (hours > 23 || hours < 0 || minutes > 59 || minutes < 0) {
    await interaction.reply({
      content: "Invalid time argument format, make sure its in HH:MM format.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const timeConvertData: TimeConverter = {
    hours: hours,
    minutes: minutes,
    timeZoneGiven: timeZoneGiven,
    timeZoneConvert: timeZoneConvert
  }

  const response: TimeResponse = ConvertTime(timeConvertData)

  const dayStr = matchDay(response.day)

  const message = `It is ${getFormatted(response.hours)}:${getFormatted(response.minutes)} ${dayStr} in ${timeConvertData.timeZoneConvert.value.name} time zone when it is ${getFormatted(hours)}:${getFormatted(minutes)} in ${timeConvertData.timeZoneGiven.value.name} time zone.`;

  await interaction.reply({
    content: message,
    flags: MessageFlags.Ephemeral
  })
}

function matchDay(day: DayDiff) {
  if (day === DayDiff.NextDay) {
    return "tomorrow"
  } else if (day === DayDiff.PrevDay) {
    return "yesterday"
  }

  return "today"
}

// This is to ensure the hours and minutes are in HH:MM format
// otherwise some inputs have time like 8:9 which is supposed to be 08:09
function getFormatted(time: number) {
  if (time < 10) {
    return "0" + `${time}`
  }

  return `${time}`
}
