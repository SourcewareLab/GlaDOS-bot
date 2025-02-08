import { MessageFlags } from 'discord-api-types/v9';
import { Events, Interaction } from 'discord.js';
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

    if (interaction.customId === 'time_zone_now') {
      const selectedValue = interaction.values[0]; // The value the user selected

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const dataPath = path.resolve(__dirname, "../../data/timeZone.json")

      const rawData: string = fs.readFileSync(dataPath, 'utf8')
      const timeZoneData: TimeZone[] = JSON.parse(rawData)

      const timeZoneFilter: TimeZone[] = timeZoneData.filter(e => e.name === selectedValue)

      if (timeZoneFilter.length === 0) {
        await interaction.reply({
          content: "time zone data not found.",
          flags: MessageFlags.Ephemeral,
        })
      }

      const timeZone: TimeZone = timeZoneFilter[0]

      const message = convertTimeNow(timeZone)

      await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

function convertTimeNow(timeZone: TimeZone) {
  const timeNow = new Date();

  const utcHours = timeNow.getUTCHours();
  const utcMinutes = timeNow.getUTCMinutes();

  let convertedHours = utcHours;
  let convertedMinutes = utcMinutes;

  if (timeZone.isPositive) {
    convertedHours += timeZone.hours
    convertedMinutes += timeZone.minutes
  } else {
    convertedHours -= timeZone.hours
    convertedMinutes -= timeZone.minutes
  }

  if (convertedMinutes >= 60) {
    convertedHours += 1;
    convertedMinutes -= 60;
  } else if (convertedMinutes < 0) {
    convertedHours -= 1;
    convertedMinutes += 60;
  }

  if (convertedHours >= 24) {
    convertedHours -= 24;
  } else if (convertedHours < 0) {
    convertedHours += 24;
  }

  return `It is ${convertedHours}:${convertedMinutes} in time zone ${timeZone.name}`
}
