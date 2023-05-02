const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the queue"),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);
    const channel = interaction.member.voice.channel;
    const embed = new EmbedBuilder()
      .setTitle("Queue resumed!")
      .setColor(0x2cfc03)
      .addFields([
        { name: "Requested by", value: `<@${interaction.user.id}>` },
      ]);

    if (!channel)
      return await interaction.editReply("🚫 User not in a channel.");
    if (!queue || !queue.isPlaying)
      return await interaction.editReply("🚫 Nothing is currently playing");
    if (queue.node.isPlaying())
      return await interaction.editReply(
        "▶️ The playback is already playing a song."
      );

    queue.node.resume();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
