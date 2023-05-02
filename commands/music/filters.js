const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Toggles an ffmpeg filter on or off.")
    .addStringOption((option) =>
      option
        .setName("filter_name")
        .setDescription("The name of the filter you want to enable or disable")
        .setRequired(true)
    ),
  async execute(interaction) {
    // TODO check input if it's valid if it isn't print a list of all the available filters
    const filter_name = interaction.options.getString("filter_name");
    const queue = useQueue(interaction.guild.id);
    const channel = interaction.member.voice.channel;

    if (!queue || !queue.isPlaying())
      return await interaction.reply("🚫 The bot is not playing any songs");
    if (!channel)
      return await interaction.reply("🚫 User not in a voice channel");

    // gets disabled filters
    console.log(queue.filters.ffmpeg.getFiltersDisabled());

    // this is case sensitive
    queue.filters.ffmpeg.toggle([filter_name]);

    await interaction.reply(`Toggled filter: ${filter_name}`);
  },
};
