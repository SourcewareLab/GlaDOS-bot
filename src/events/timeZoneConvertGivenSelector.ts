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
          new StringSelectMenuOptionBuilder().setLabel('Hawaii-Aleutian Standard Time (HST) -10:00').setValue('HST'),
          new StringSelectMenuOptionBuilder().setLabel('Alaska Standard Time (AKST) -09:00').setValue('AKST'),
          new StringSelectMenuOptionBuilder().setLabel('Pacific Standard Time (PST) -08:00').setValue('PST'),
          new StringSelectMenuOptionBuilder().setLabel('Mountain Standard Time (MST) -07:00').setValue('MST'),
          new StringSelectMenuOptionBuilder().setLabel('Central Standard Time (CST) -06:00').setValue('CST'),
          new StringSelectMenuOptionBuilder().setLabel('Eastern Standard Time (EST) -05:00').setValue('EST'),
          new StringSelectMenuOptionBuilder().setLabel('Atlantic Standard Time (AST) -04:00').setValue('AST'),
          new StringSelectMenuOptionBuilder().setLabel('Argentina Time (ART) -03:00').setValue('ART'),
          new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT) +00:00').setValue('GMT'),
          new StringSelectMenuOptionBuilder().setLabel('Central European Time (CET) +01:00').setValue('CET'),
          new StringSelectMenuOptionBuilder().setLabel('Eastern European Time (EET) +02:00').setValue('EET'),
          new StringSelectMenuOptionBuilder().setLabel('Moscow Standard Time (MSK) +03:00').setValue('MSK'),
          new StringSelectMenuOptionBuilder().setLabel('Iran Standard Time (IRST) +03:30').setValue('IRST'),
          new StringSelectMenuOptionBuilder().setLabel('Gulf Standard Time (GST) +04:00').setValue('GST'),
          new StringSelectMenuOptionBuilder().setLabel('Pakistan Standard Time (PKT) +05:00').setValue('PKT'),
          new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST) +05:30').setValue('IST'),
          new StringSelectMenuOptionBuilder().setLabel('Bangladesh Standard Time (BST) +06:00').setValue('BST'),
          new StringSelectMenuOptionBuilder().setLabel('Myanmar Time (MMT) +06:30').setValue('MMT'),
          new StringSelectMenuOptionBuilder().setLabel('Indochina Time (ICT) +07:00').setValue('ICT'),
          new StringSelectMenuOptionBuilder().setLabel('China Standard Time (CST) +08:00').setValue('CNST'),
          new StringSelectMenuOptionBuilder().setLabel('Japan Standard Time (JST) +09:00').setValue('JST'),
          new StringSelectMenuOptionBuilder().setLabel('Australian Eastern Standard Time (AEST) +10:00').setValue('AEST'),
          new StringSelectMenuOptionBuilder().setLabel('New Zealand Standard Time (NZST) +12:00').setValue('NZST'),
          new StringSelectMenuOptionBuilder().setLabel('Line Islands Time (LINT) +14:00').setValue('LINT'),

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
