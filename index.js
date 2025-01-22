import { Client, Events, GatewayIntentBits } from "discord.js";
import 'dotenv/config';

const token = process.env.TOKEN;

const client = new Client({ intents: [] });

client.once(Events.ClientReady, readyClient => {
  console.log('Ready!', `Logged in as ${readyClient.user.tag}`);
});

client.on('interactionCreate', (interaction) => {
  if (interaction.commandName === 'ping') {
    interaction.reply('Pong');
  }
});

client.login(token);