const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
const { getVoiceConnection } = require("@discordjs/voice");

// TO_DO respond with an embed

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips a song from the queue."),
  async execute(interaction) {
    await interaction.deferReply();
    const channel = interaction.member.voice.channel;

    // get connection
    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!channel)
      return interaction.editReply(
        "🚫 You are not connected to a voice channel !"
      ); // make sure we have a voice channel
    if (channel != connection.joinConfig.channelId)
      return interaction.editReply(
        "🚫 You are not in the same channel as the bot!"
      );

    const player = useMasterPlayer(); // Get the player instance that we created earlier
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying())
      return interaction.editReply("🙀 Nothing is playing.");

    const currentTrack = queue.currentTrack;

    try {
      queue.node.skip();
      await interaction.editReply(`Skipped: **${currentTrack.title}**`);
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
};
