import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = await import(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" propriety.`);
    }
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log('Ready!', `Logged in as ${readyClient.user.tag}`);
});

client.login(token);