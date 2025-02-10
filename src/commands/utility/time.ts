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
    .setDescription("Provides time related commands to the user.")

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
        .addStringOption(option =>
          option.setName("giventime")
            .setDescription("the time that should be converted in format HH:MM")
            .setRequired(true))
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
        break
      default:
        await interaction.reply({
          content: "Subcommand not found.",
          flags: MessageFlags.Ephemeral
        })
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

async function convert(interaction: ChatInputCommandInteraction) {
  const givenTime = interaction.options.getString('giventime');

  const selectMenuGiven = new StringSelectMenuBuilder()
    // data has to be passed to the second dropdown select in this way, the data is seperated by a '-'
    .setCustomId(`time_zone_given-${givenTime}`)
    .setPlaceholder('Choose the appropriate time zone...')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT)').setValue('GMT'),
      new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST)').setValue('IST'),
      new StringSelectMenuOptionBuilder().setLabel('European Standard Time (EST)').setValue('EST')
    );

  const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuGiven);

  await interaction.reply({
    content: 'Please select the Time Zone for the given time:-',
    components: [row1],
    flags: MessageFlags.Ephemeral
  });
}
