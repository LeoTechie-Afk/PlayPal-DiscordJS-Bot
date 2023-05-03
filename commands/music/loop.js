const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops the song currently playing")
    .addBooleanOption((option) =>
      option
        .setName("mode")
        .setDescription("Wheter the song should be looped or not")
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const mode = interaction.options.getBoolean("mode");

    if (mode) queue.setRepeatMode(QueueRepeatMode.TRACK);
    else queue.setRepeatMode(QueueRepeatMode.OFF);

    await interaction.reply(`The loop mode has been set to **${mode}**`);
  },
};
