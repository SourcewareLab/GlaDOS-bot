import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  printServerRoles,
  printServerInfo,
  printUserInfo,
  printProjectInfo,
  printProjectList
} from "./subcommands/subcommands.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("General ")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("roles")
        .setDescription("Provides a list of roles for the server."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Provides information about the server."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Provides information about the user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The username to search for")
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("project")
        .setDescription("Provides information about a project.")
        .addStringOption((option) =>
          option
            .setName("project")
            .setDescription("The project to view details for.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("project-list")
        .setDescription("Provides a list of all project."),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "roles":
        await printServerRoles(interaction);
        break;
      case "server":
        await printServerInfo(interaction);
        break;
      case "user":
        await printUserInfo(interaction);
        break;
      case "project":
        await printProjectInfo(interaction);
        break;
      case "project-list":
        await printProjectList(interaction);
        break;
    }
  },
};
