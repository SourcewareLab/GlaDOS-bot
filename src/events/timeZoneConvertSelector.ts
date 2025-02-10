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

    const values = interaction.customId.split("-")

    if (values[0] === 'time_zone_given_convert') {
      const selectedValue = interaction.values[0]; // The value the user selected

      const timeString = values[1]
      if (!timeString) {
        console.log("time is not provided or is invalid.");
        return
      }

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

      const [hours, minutes] = convertTime(timeZone, timeString)

      await interaction.reply({
        content: `The Converted time is ${hours}:${minutes} in ${timeZone.name}`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

function convertTime(timeZone: TimeZone, time: string) {
  const [hoursString, minutesString] = time.split(":");

  let hours = parseInt(hoursString);
  let minutes = parseInt(minutesString);

  if (timeZone.isPositive) {
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
