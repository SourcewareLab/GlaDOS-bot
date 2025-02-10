import { MessageFlags } from 'discord-api-types/v9';
import { Events, Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


interface TimeZone {
  name: string;
  isPositive: boolean;
  hours: number;
  minutes: number;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const values = interaction.customId.split("-");

    if (values[0] === 'time_zone_given') {
      const selectedValue = interaction.values[0]; // The value the user selected

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const dataPath = path.resolve(__dirname, "../../data/timeZone.json")

      const rawData: string = fs.readFileSync(dataPath, 'utf8')
      const timeZoneData: TimeZone[] = JSON.parse(rawData)

      const timeZoneFilter: TimeZone[] = timeZoneData.filter(e => e.name === selectedValue)

      if (!values[1]) {
        await interaction.reply({
          content: "Time data not found",
          flags: MessageFlags.Ephemeral
        })
      }

      if (timeZoneFilter.length === 0) {
        await interaction.reply({
          content: "time zone data not found.",
          flags: MessageFlags.Ephemeral,
        })
      }

      const timeZone: TimeZone = timeZoneFilter[0]
      const [hours, minutes] = convertTime(timeZone, values[1])

      const selectMenuConvert = new StringSelectMenuBuilder()
        // data has to be passed to the second dropdown select in this way, the data is seperated by a '-'
        .setCustomId(`time_zone_given_convert-${hours}:${minutes}`)
        .setPlaceholder('Choose the appropriate time zone...')
        .addOptions(
          new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT)').setValue('GMT'),
          new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST)').setValue('IST'),
          new StringSelectMenuOptionBuilder().setLabel('European Standard Time (EST)').setValue('EST')
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuConvert);

      await interaction.reply({
        content: `The Given time is ${hours}:${minutes} in GMT`,
        flags: MessageFlags.Ephemeral
      });

      await interaction.followUp({
        content: 'Please select the Time Zone to convert to:-',
        components: [row]
      })
    }
  }
};

function convertTime(timeZone: TimeZone, time: string) {
  const [hoursString, minutesString] = time.split(":");

  let hours = parseInt(hoursString);
  let minutes = parseInt(minutesString);

  // '!' because the hours and minutes needs to be subtracted for +HH:MM time zone to convert to GMT
  if (!timeZone.isPositive) {
    hours += timeZone.hours
    minutes += timeZone.minutes
  } else {
    hours -= timeZone.hours
    minutes -= timeZone.minutes
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
