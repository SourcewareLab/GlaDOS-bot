import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
} from 'discord.js';

interface TimeZone {
  name: string;
  value: {
    name: string;
    isPositive: boolean;
    hours: number;
    minutes: number;
  }
}

const timeZoneData: TimeZone[] = [
  {
    "name": "Hawaii Standard Time (HST)",
    "value": {
      "name": "HST",
      "isPositive": false,
      "hours": 10,
      "minutes": 0
    }
  },
  {
    "name": "Alaska Standard Time (AKST)",
    "value": {
      "name": "AKST",
      "isPositive": false,
      "hours": 9,
      "minutes": 0
    }
  },
  {
    "name": "Pacific Standard Time (PST)",
    "value": {
      "name": "PST",
      "isPositive": false,
      "hours": 8,
      "minutes": 0
    }
  },
  {
    "name": "Mountain Standard Time (MST)",
    "value": {
      "name": "MST",
      "isPositive": false,
      "hours": 7,
      "minutes": 0
    }
  },
  {
    "name": "Central Standard Time (CST)",
    "value": {
      "name": "CST",
      "isPositive": false,
      "hours": 6,
      "minutes": 0
    }
  },
  {
    "name": "Eastern Standard Time (EST)",
    "value": {
      "name": "EST",
      "isPositive": false,
      "hours": 5,
      "minutes": 0
    }
  },
  {
    "name": "Atlantic Standard Time (AST)",
    "value": {
      "name": "AST",
      "isPositive": false,
      "hours": 4,
      "minutes": 0
    }
  },
  {
    "name": "Argentina Time (ART)",
    "value": {
      "name": "ART",
      "isPositive": false,
      "hours": 3,
      "minutes": 0
    }
  },
  {
    "name": "Greenwich Mean Time (GMT)",
    "value": {
      "name": "GMT",
      "isPositive": true,
      "hours": 0,
      "minutes": 0
    }
  },
  {
    "name": "Central European Time (CET)",
    "value": {
      "name": "CET",
      "isPositive": true,
      "hours": 1,
      "minutes": 0
    }
  },
  {
    "name": "Eastern European Time (EET)",
    "value": {
      "name": "EET",
      "isPositive": true,
      "hours": 2,
      "minutes": 0
    }
  },
  {
    "name": "Moscow Standard Time (MSK)",
    "value": {
      "name": "MSK",
      "isPositive": true,
      "hours": 3,
      "minutes": 0
    }
  },
  {
    "name": "Iran Standard Time (IRST)",
    "value": {
      "name": "IRST",
      "isPositive": true,
      "hours": 3,
      "minutes": 30
    }
  },
  {
    "name": "Gulf Standard Time (GST)",
    "value": {
      "name": "GST",
      "isPositive": true,
      "hours": 4,
      "minutes": 0
    }
  },
  {
    "name": "Pakistan Standard Time (PKT)",
    "value": {
      "name": "PKT",
      "isPositive": true,
      "hours": 5,
      "minutes": 0
    }
  },
  {
    "name": "Indian Standard Time (IST)",
    "value": {
      "name": "IST",
      "isPositive": true,
      "hours": 5,
      "minutes": 30
    }
  },
  {
    "name": "Bangladesh Standard Time (BST)",
    "value": {
      "name": "BST",
      "isPositive": true,
      "hours": 6,
      "minutes": 0
    }
  },
  {
    "name": "Myanmar Time (MMT)",
    "value": {
      "name": "MMT",
      "isPositive": true,
      "hours": 6,
      "minutes": 30
    }
  },
  {
    "name": "Indochina Time (ICT)",
    "value": {
      "name": "ICT",
      "isPositive": true,
      "hours": 7,
      "minutes": 0
    }
  },
  {
    "name": "China Standard Time (CNST)",
    "value": {
      "name": "CNST",
      "isPositive": true,
      "hours": 8,
      "minutes": 0
    }
  },
  {
    "name": "Japan Standard Time (JST)",
    "value": {
      "name": "JST",
      "isPositive": true,
      "hours": 9,
      "minutes": 0
    }
  },
  {
    "name": "Australian Eastern Standard Time (AEST)",
    "value": {
      "name": "AEST",
      "isPositive": true,
      "hours": 10,
      "minutes": 0
    }
  },
  {
    "name": "New Zealand Standard Time (NZST)",
    "value": {
      "name": "NZST",
      "isPositive": true,
      "hours": 12,
      "minutes": 0
    }
  },
  {
    "name": "Line Islands Time (LINT)",
    "value": {
      "name": "LINT",
      "isPositive": true,
      "hours": 14,
      "minutes": 0
    }
  }
]



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

  const [convertedHours, convertedMinutes] = convertTime(timeZone, hours, minutes, false)

  await interaction.reply({
    content: `It is ${convertedHours}:${convertedMinutes} in ${timeZone.name} time zone`,
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

  const [hours, minutes] = time.split(":");
  if (!hours || !minutes || time.split(":").length > 2) {
    await interaction.reply({
      content: "Invalid time argument format, make sure its in HH:MM format.",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const [givenHours, givenMinutes] = convertTime(timeZoneGiven, parseInt(hours), parseInt(minutes), true)

  const [convertedHours, convertedMinutes] = convertTime(timeZoneConvert, givenHours, givenMinutes, false)

  await interaction.reply({
    content: `It is ${convertedHours}:${convertedMinutes} in ${timeZoneConvert.name} when it is ${hours}:${minutes} in ${timeZoneGiven.name}`,
    flags: MessageFlags.Ephemeral
  })
}

function convertTime(timeZone: TimeZone, hours: number, minutes: number, convertOpposite: boolean) {
  const timeZoneVal = timeZone.value;

  let isPositive: boolean = timeZoneVal.isPositive;

  // To check if we are converting from XYZ time zone -> GMT instead of vice versa
  if (convertOpposite) {
    isPositive = !isPositive
  }

  if (isPositive) {
    hours += timeZoneVal.hours
    minutes += timeZoneVal.minutes
  } else {
    hours -= timeZoneVal.hours
    minutes -= timeZoneVal.minutes
  }

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  } else if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  if (hours >= 24) {
    hours -= 24;
  } else if (hours < 0) {
    hours += 24;
  }

  return [hours, minutes]
}
