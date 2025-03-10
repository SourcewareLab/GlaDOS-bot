import { AppClient } from "@/index.js";
import { ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags } from "discord.js";
import { RequestError } from "octokit";

// After DB is figured out
//TODO: Add a Project Leads section
//TODO: Add a Description

export async function printProjectInfo(interaction: ChatInputCommandInteraction) {
  // Ensure the command is executed in a guild
  if (!interaction.guild) {
    await interaction.reply({
      content: "This command can only be used within a server.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const client = interaction.client as AppClient & Client;

  const project = interaction.options.getString("project");

  try { //Octokit throws an error when not found

    const reqBody = {
      owner: "SourcewareLab",
      repo: project as string,
    };

    const resp = await client.octokit.rest.repos.get(reqBody)

    const languages = await client.octokit.rest.repos.listLanguages(reqBody)

    let languageString = '';

    for (const lang of Object.keys(languages.data)) {
      languageString += lang + ', '
    }

    const message = `
      **Languages**: ${languageString.slice(0, -2)}\n
      **Issues**: There are [**${resp.data.open_issues}**](${resp.data.html_url + "/issues"}) Open Issues that you can work on. 
      `.trimStart(); // to allow formatting here, but ignore the tabs in Response

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(resp.data.name)
      .setURL(resp.data.html_url)
      .setDescription(message)
      .setThumbnail(resp.data.owner.avatar_url)

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    })

  } catch (err) {
    if (err instanceof RequestError && err.status === 404) { // Checks if Repo was not found ,ie, 404 error.
      await interaction.reply({
        content: `Could not find repository make sure the name was correct. `,
        flags: MessageFlags.Ephemeral
      })
      return;
    }

    await interaction.reply({
      content: `Error while trying to query the Github API -> ${err} `,
      flags: MessageFlags.Ephemeral
    })
  }
}
