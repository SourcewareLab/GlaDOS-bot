import { Events, GuildMember, ChannelType } from 'discord.js';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const channelID = process.env.WELCOME_CHANNEL_ID;
    const roleID = process.env.NEWCOMER_ROLE_ID;

    if (!channelID || !roleID) {
      console.log("missing environment variables");
      return
    }

    const channel = member.guild.channels.cache.get(channelID);
    if (!channel) {
      console.log("Welcome Channel not Found");
      return
    }

    const role = member.guild.roles.cache.get(roleID);
    if (!role) {
      console.log("Newcomer Role not found");
      return
    }

    const message = `Welcome to Sourceware Labs, <@${member.id}>`

    // Message can only be sent if the channel is a Text Channel
    if (channel.type !== ChannelType.GuildText) {
      console.log("the welcome channel is not a Text Channel");
      return
    }

    await Promise.all([channel.send(message), member.roles.add(role)]);
  }
}

