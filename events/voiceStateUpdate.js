const { Events, ChatInputCommandInteraction } = require("discord.js");
const { getVoiceConnection, joinConfig } = require("@discordjs/voice");
const { useMasterPlayer } = require("discord-player");

module.exports = {
  name: Events.VoiceStateUpdate,
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(guildId);

    try {
      if (!connection) return;
      if (voiceChannel != connection.joinConfig.channelId) return;

      let memberCount = 0;
      let deafMemberCount = 0;

      const player = useMasterPlayer();
      const guildId = interaction.guild.id;
      const queue = player.nodes.get(guildId);

      interaction.guild.channels.cache
        .get(voiceChannel.id)
        .members.forEach((member) => {
          memberCount++;
          if (member.voice.selfDeaf || member.voice.serverDeaf)
            deafMemberCount++;
        });

      if (deafMemberCount === memberCount) {
        if (!queue || !queue.isPlaying()) {
          queue.metadata.channel.send("🔇 Leaving because everyone is muted.");

          connection.destroy();

          return;
        }

        await player.destroy();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
