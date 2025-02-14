import { AppClient } from "@/index.js";
import { Events } from "discord.js";

export const event = {
  name: Events.ClientReady,
  once: true,
  execute(client: AppClient) {
    if (!client.user) {
      console.error("Error: client.user doesn't exist");
      return;
    }
    console.log("Ready!", `Logged in as ${client.user.tag}`);
  },
};
