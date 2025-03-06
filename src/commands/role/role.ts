import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import {
  addRole,
  removeRole,
  addRoleAll,
  removeRoleAll,
  replaceRoleAll,
} from "./subcommands/subcommands.js";

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
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-all")
        .setDescription(
          "assign all users that dont have a role or only have the newcomer role with a given role.",
        )
        .addRoleOption((option) =>
          option
            .setName("assign_role")
            .setDescription(
              "the role that should be added to all normal users.",
            )
            .setRequired(true),
        ),
    )

    //subcommand for unassigning a role to all members that have that role.
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-all")
        .setDescription("unassign a role from all users that have it.")
        .addRoleOption((option) =>
          option
            .setName("remove_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true),
        ),
    )

    //subcommand for replacing a role from all members that have that role.
    .addSubcommand((subcommand) =>
      subcommand
        .setName("replace-all")
        .setDescription(
          "replace a role with another for all users that have it.",
        )
        .addRoleOption((option) =>
          option
            .setName("remove_role")
            .setDescription("the role that should be removed from all users.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("add_role")
            .setDescription("the role that should be replaced on all users.")
            .setRequired(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "add":
        await addRole(interaction);
        break;
      case "remove":
        await removeRole(interaction);
        break;
      case "add-all":
        await addRoleAll(interaction);
        break;
      case "remove-all":
        await removeRoleAll(interaction);
        break;
      case "replace-all":
        await replaceRoleAll(interaction);
        break;
    }
  },
};
