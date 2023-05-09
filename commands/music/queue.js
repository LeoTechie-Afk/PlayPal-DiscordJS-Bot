const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the current queue"),
  async execute(interaction) {
    await interaction.deferReply();

    const channel = interaction.member.voice.channel;
    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack; // current track
    let description = "";

    if (!queue || !queue.isPlaying())
      return await interaction.editReply("🚫 The bot is not playing any songs");
    if (!channel)
      return await interaction.editReply("🚫 User not in a voice channel");

    const embed = new EmbedBuilder()
      .setTitle("🔊 Current queue:")
      .setColor(0x6666ff)
      .addFields([{ name: "Requested by", value: `<@${interaction.user.id}>` }])
      .setThumbnail(track.thumbnail);

    const tracks = queue.tracks.toArray();

    // adds current track's title with url to the description
    description += `1 - [${track.title}](${track.url})\n`;

    if (tracks.length > 0) {
      // adding 20 songs to the description
      for (let i = 1; i < 20 && i < tracks.length; i++) {
        description += `${i + 1} - [${tracks[i].title}](${tracks[i].url})\n`;
      }
    }

    if (tracks.length > 20) description += `...And ${tracks.length - 20} more`;

    embed.setDescription(description);

    await interaction.editReply({ embeds: [embed] });
  },
};
