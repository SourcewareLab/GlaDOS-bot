import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { AppDatabase } from "./data/database.js";
import { runMigrations } from "@/data/migrate.js";

type Command = {
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
};

export class AppClient extends Client {
  commands: Collection<string, Command>;
  db: AppDatabase;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        // required for Event GuildMemberAdd
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.commands = new Collection();
    this.db = AppDatabase.getInstance();
  }

  destroy() {
    return super.destroy();
  }
}

const token = process.env.TOKEN;

//Yeah we will restructure index.ts later lol
const client = new AppClient();
await client.db.initialize();

// for development we should definitely have this, but for production it might make more sense to run it manually
if (process.env.NODE_ENV === "local") {
  await runMigrations();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = await import(pathToFileURL(filePath).toString());

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" propriety.`,
      );
    }
  }
}

// Dynamically load event handlers from the 'events' folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const { event } = await import(pathToFileURL(filePath).toString());
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}
client.login(token);
