import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,  SlashCommandBuilder,
} from "discord.js";
import { addRole } from "./subcommands/addRole.js";
import { removeRole } from "./subcommands/removeRole.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Role management") // im open to changing this
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    // Subcommand for adding a role
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to be used") // im open to changing this
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to add role to") // im open to changing this
            .setRequired(true),
        ),
    )

    // Subcommand for removing a role
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to be used") // im open to changing this
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to add role to") // im open to changing this
            .setRequired(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "add":
        // add(interaction);
        await addRole(interaction)
        break;
      case "remove":
        await removeRole(interaction);
        break;
    }
  },
};