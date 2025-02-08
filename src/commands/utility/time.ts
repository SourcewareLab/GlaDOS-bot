import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder
} from 'discord.js';


export const command = {
  data: new SlashCommandBuilder()
    .setName('time')
    .setDescription('Provides time related commands to the user.')

    //subcommand for converting current time
    .addSubcommand(subcommand =>
      subcommand
        .setName("now")
        .setDescription("converts current time to some Time Zone")
    )

    //subcommand for converting time to different time zone
    .addSubcommand(subcommand =>
      subcommand
        .setName("convert")
        .setDescription("converts given time to some Time Zone")
    )
  ,

  async execute(interaction: ChatInputCommandInteraction) {
    // Ensure the command is executed in a guild
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used within a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const subCommand = interaction.options.getSubcommand()

    switch (subCommand) {
      case "now":
        now(interaction)
        break;
      case "convert":
        convert(interaction)
    }
  }
}

async function now(interaction: ChatInputCommandInteraction) {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('time_zone_now')
    .setPlaceholder('Choose the appropriate time zone...')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT)').setValue('GMT'),
      new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST)').setValue('IST'),
      new StringSelectMenuOptionBuilder().setLabel('European Standard Time (EST)').setValue('EST')
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await interaction.reply({
    content: 'Please select an option:',
    components: [row],
  });
}

function convert(interaction: ChatInputCommandInteraction) {
  console.log(interaction);

}
