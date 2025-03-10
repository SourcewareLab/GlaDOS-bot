import { AppClient } from "@/index.js";
import { ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags } from "discord.js";
import { RequestError } from "octokit";

export async function printProjectList(interaction: ChatInputCommandInteraction) {
  // Ensure the command is executed in a guild
  if (!interaction.guild) {
    await interaction.reply({
      content: "This command can only be used within a server.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const client = interaction.client as AppClient & Client;

  try { //Octokit throws an error when not found

    const reqBody = {
      org: "SourcewareLab",
    };

    const resp = await client.octokit.rest.repos.listForOrg(reqBody)

    let message = '';

    resp.data.forEach((repo) => {
      message += `**•** [${repo.name}](${repo.html_url})` + '\n'
    })

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("Community Projects")
      .setDescription(message)
      .setThumbnail(resp.data[0].owner.avatar_url)

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral]
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
