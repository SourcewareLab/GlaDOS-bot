import { ChannelType } from "discord-api-types/v9";
import { ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

type Command = {
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

class ClientWithCommands extends Client {
  commands: Collection<string, unknown>

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        // required for Event GuildMemberAdd
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
      ]
    });
    this.commands = new Collection();
  }
}

const token = process.env.TOKEN;
const client = new ClientWithCommands();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = await import(pathToFileURL(filePath).toString());

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" propriety.`);
    }
  }
  console.log(client.commands);
}

client.once(Events.ClientReady, readyClient => {
  console.log('Ready!', `Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;


  const command = client.commands.get(interaction.commandName) as Command;

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

client.on(Events.GuildMemberAdd, async member => {
  const channelID = process.env.WELCOME_CHANNEL_ID;
  const roleID = process.env.NEWCOMER_ROLE_ID;

  if (!channelID || !roleID) {
    console.log("missing environment variables");
    return
  }

  const channel = member.guild.channels.cache.get(channelID);
  if (!channel) {
    console.log("Welcome Channel not Found");
    return
  }

  const role = member.guild.roles.cache.get(roleID);
  if (!role) {
    console.log("Newcomer Role not found");
    return
  }

  const message = `Welcome to Sourceware Labs, <@${member.id}>`

  // Message can only be sent if the channel is a Text Channel
  if (channel.type !== ChannelType.GuildText) {
    console.log("the welcome channel is not a Text Channel");
    return
  }

  await Promise.all([channel.send(message), member.roles.add(role)]);
})

client.login(token);
