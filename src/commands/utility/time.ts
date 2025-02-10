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
      new StringSelectMenuOptionBuilder().setLabel('Hawaii-Aleutian Standard Time (HST) -10:00').setValue('HST'),
      new StringSelectMenuOptionBuilder().setLabel('Alaska Standard Time (AKST) -09:00').setValue('AKST'),
      new StringSelectMenuOptionBuilder().setLabel('Pacific Standard Time (PST) -08:00').setValue('PST'),
      new StringSelectMenuOptionBuilder().setLabel('Mountain Standard Time (MST) -07:00').setValue('MST'),
      new StringSelectMenuOptionBuilder().setLabel('Central Standard Time (CST) -06:00').setValue('CST'),
      new StringSelectMenuOptionBuilder().setLabel('Eastern Standard Time (EST) -05:00').setValue('EST'),
      new StringSelectMenuOptionBuilder().setLabel('Atlantic Standard Time (AST) -04:00').setValue('AST'),
      new StringSelectMenuOptionBuilder().setLabel('Argentina Time (ART) -03:00').setValue('ART'),
      new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT) +00:00').setValue('GMT'),
      new StringSelectMenuOptionBuilder().setLabel('Central European Time (CET) +01:00').setValue('CET'),
      new StringSelectMenuOptionBuilder().setLabel('Eastern European Time (EET) +02:00').setValue('EET'),
      new StringSelectMenuOptionBuilder().setLabel('Moscow Standard Time (MSK) +03:00').setValue('MSK'),
      new StringSelectMenuOptionBuilder().setLabel('Iran Standard Time (IRST) +03:30').setValue('IRST'),
      new StringSelectMenuOptionBuilder().setLabel('Gulf Standard Time (GST) +04:00').setValue('GST'),
      new StringSelectMenuOptionBuilder().setLabel('Pakistan Standard Time (PKT) +05:00').setValue('PKT'),
      new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST) +05:30').setValue('IST'),
      new StringSelectMenuOptionBuilder().setLabel('Bangladesh Standard Time (BST) +06:00').setValue('BST'),
      new StringSelectMenuOptionBuilder().setLabel('Myanmar Time (MMT) +06:30').setValue('MMT'),
      new StringSelectMenuOptionBuilder().setLabel('Indochina Time (ICT) +07:00').setValue('ICT'),
      new StringSelectMenuOptionBuilder().setLabel('China Standard Time (CST) +08:00').setValue('CNST'),
      new StringSelectMenuOptionBuilder().setLabel('Japan Standard Time (JST) +09:00').setValue('JST'),
      new StringSelectMenuOptionBuilder().setLabel('Australian Eastern Standard Time (AEST) +10:00').setValue('AEST'),
      new StringSelectMenuOptionBuilder().setLabel('New Zealand Standard Time (NZST) +12:00').setValue('NZST'),
      new StringSelectMenuOptionBuilder().setLabel('Line Islands Time (LINT) +14:00').setValue('LINT'),
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await interaction.reply({
    content: 'Please select an option:',
    components: [row],
  });
}

async function convert(interaction: ChatInputCommandInteraction) {
  const givenTime = interaction.options.getString('giventime');
  if (!givenTime) {
    await interaction.reply({
      content: "missing arguments",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const [hours, minutes] = givenTime.split(":")
  if (!hours || !minutes) {
    await interaction.reply({
      content: "invalid arguments provided",
      flags: MessageFlags.Ephemeral
    })
    return
  }

  const selectMenuGiven = new StringSelectMenuBuilder()
    // data has to be passed to the second dropdown select in this way, the data is seperated by a '-'
    .setCustomId(`time_zone_given-${givenTime}`)
    .setPlaceholder('Choose the appropriate time zone...')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('Hawaii-Aleutian Standard Time (HST) -10:00').setValue('HST'),
      new StringSelectMenuOptionBuilder().setLabel('Alaska Standard Time (AKST) -09:00').setValue('AKST'),
      new StringSelectMenuOptionBuilder().setLabel('Pacific Standard Time (PST) -08:00').setValue('PST'),
      new StringSelectMenuOptionBuilder().setLabel('Mountain Standard Time (MST) -07:00').setValue('MST'),
      new StringSelectMenuOptionBuilder().setLabel('Central Standard Time (CST) -06:00').setValue('CST'),
      new StringSelectMenuOptionBuilder().setLabel('Eastern Standard Time (EST) -05:00').setValue('EST'),
      new StringSelectMenuOptionBuilder().setLabel('Atlantic Standard Time (AST) -04:00').setValue('AST'),
      new StringSelectMenuOptionBuilder().setLabel('Argentina Time (ART) -03:00').setValue('ART'),
      new StringSelectMenuOptionBuilder().setLabel('Greenwich Mean Time (GMT) +00:00').setValue('GMT'),
      new StringSelectMenuOptionBuilder().setLabel('Central European Time (CET) +01:00').setValue('CET'),
      new StringSelectMenuOptionBuilder().setLabel('Eastern European Time (EET) +02:00').setValue('EET'),
      new StringSelectMenuOptionBuilder().setLabel('Moscow Standard Time (MSK) +03:00').setValue('MSK'),
      new StringSelectMenuOptionBuilder().setLabel('Iran Standard Time (IRST) +03:30').setValue('IRST'),
      new StringSelectMenuOptionBuilder().setLabel('Gulf Standard Time (GST) +04:00').setValue('GST'),
      new StringSelectMenuOptionBuilder().setLabel('Pakistan Standard Time (PKT) +05:00').setValue('PKT'),
      new StringSelectMenuOptionBuilder().setLabel('Indian Standard Time (IST) +05:30').setValue('IST'),
      new StringSelectMenuOptionBuilder().setLabel('Bangladesh Standard Time (BST) +06:00').setValue('BST'),
      new StringSelectMenuOptionBuilder().setLabel('Myanmar Time (MMT) +06:30').setValue('MMT'),
      new StringSelectMenuOptionBuilder().setLabel('Indochina Time (ICT) +07:00').setValue('ICT'),
      new StringSelectMenuOptionBuilder().setLabel('China Standard Time (CST) +08:00').setValue('CNST'),
      new StringSelectMenuOptionBuilder().setLabel('Japan Standard Time (JST) +09:00').setValue('JST'),
      new StringSelectMenuOptionBuilder().setLabel('Australian Eastern Standard Time (AEST) +10:00').setValue('AEST'),
      new StringSelectMenuOptionBuilder().setLabel('New Zealand Standard Time (NZST) +12:00').setValue('NZST'),
      new StringSelectMenuOptionBuilder().setLabel('Line Islands Time (LINT) +14:00').setValue('LINT'),
    );

  const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenuGiven);

  await interaction.reply({
    content: 'Please select the Time Zone for the given time:-',
    components: [row1],
    flags: MessageFlags.Ephemeral
  });
}
