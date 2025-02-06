import {ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, MessageFlags} from "discord.js";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {AppDatabase} from "./data/database.js";


export type AppChatInputCommandInteraction = ChatInputCommandInteraction & {
    client: AppClient;
}

type Command = {
    execute(interaction: AppChatInputCommandInteraction): Promise<void>;
}

class AppClient extends Client {
    commands: Collection<string, Command>
    db: AppDatabase;

    constructor() {
        super({intents: [
            GatewayIntentBits.Guilds,
            // required for Event GuildMemberAdd
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMembers
          ]});
        this.commands = new Collection();
        this.db = AppDatabase.getInstance();
    }

    destroy() {
        return super.destroy();
    }
}

const token = process.env.TOKEN;
const client = new AppClient();
await client.db.initialize();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file =>
        file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const {command} = await import(pathToFileURL(filePath).toString());

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" propriety.`);
        }
    }
}

// Dynamically load event handlers from the 'events' folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
  import(path.join(eventsPath, file)).then((event) => {
    if (event.default && event.default.name) {
      client.on(event.default.name, (...args) => event.default.execute(...args));
      console.log(`Loaded event: ${event.default.name}`);
    }
  }).catch(err => console.error(`Failed to load event ${file}:`, err));
}

client.once(Events.ClientReady, readyClient => {
    console.log('Ready!', `Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;


    const typedInteraction = interaction as AppChatInputCommandInteraction;
    const command = typedInteraction.client.commands.get(interaction.commandName) as Command;

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(typedInteraction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.login(token);