const { useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the queue"),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);
    const channel = interaction.member.voice.channel;
    const embed = new EmbedBuilder()
      .setTitle("Queue paused!")
      .setColor(0x0000ff)
      .addFields([
        { name: "Requested by", value: `<@${interaction.user.id}>` },
      ]);

    if (!channel)
      return await interaction.editReply("🚫 User not in a channel.");
    if (!queue || !queue.isPlaying)
      return await interaction.editReply("🚫 Nothing is currently playing.");
    if (queue.node.isPaused())
      return await interaction.editReply(
        "⏸️ The playback has already been paused."
      );

    queue.node.pause();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
