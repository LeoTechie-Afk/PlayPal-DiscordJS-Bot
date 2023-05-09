const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription(
      "Gives information about the song that is currently playing"
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const channel = interaction.member.voice.channel;
    const queue = useQueue(interaction.guild.id);

    const embed = new EmbedBuilder()
      .setTitle("Currently playing song!")
      .setColor(0x6666ff)
      .addFields([
        { name: "Requested by", value: `<@${interaction.user.id}>` },
      ]);

    if (!channel)
      return await interaction.editReply(
        "🚫 User is not connected to a channel!"
      );
    if (!queue || !queue.isPlaying())
      return await interaction.editReply(
        "🚫 The bot is not playing any songs!"
      );

    // current track
    const track = queue.currentTrack;

    embed
      .setDescription(
        `[${track.title}](${track.url})\nDuration: ${track.duration}\n`
      )
      .setThumbnail(track.thumbnail);

    interaction.editReply({ embeds: [embed] });
  },
};
