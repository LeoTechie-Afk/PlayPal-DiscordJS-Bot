const { useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Toggles an ffmpeg filter on or off.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Toggles an ffmpeg filter on or off.")
        .addStringOption((option) =>
          option
            .setName("filter")
            .setDescription("The name of the filter you want to toggle.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("default")
        .setDescription("Sets the filters to default")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enabled")
        .setDescription("Gives a list of all the enabled filters.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Lists all the available filters")
    ),
  async execute(interaction) {
    // check which subcommand the user calls
    const queue = useQueue(interaction.guild.id);
    const channel = interaction.member.voice.channel;

    if (!channel)
      return await interaction.reply("🚫 User not in a voice channel");
    if (!queue || !queue.isPlaying())
      return await interaction.reply("🚫 The bot is not playing any songs");

    const filters = queue.filters.ffmpeg
      .getFiltersDisabled()
      .concat(queue.filters.ffmpeg.getFiltersEnabled());

    switch (interaction.options._subcommand) {
      case "toggle":
        // toggles a filter on or off
        const filter_name = interaction.options.getString("filter");

        if (!filters.includes(filter_name))
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(
                  `No result found for ${filter_name}! Here's a list of all the filters:`
                )
                .setDescription(filters.sort().join("\n"))
                .setColor(0xe50000),
            ],
          });

        queue.filters.ffmpeg.toggle([filter_name]);

        await interaction.reply(`Toggled filter: **${filter_name}**`);
        break;
      case "default":
        // sets the filters to their default value
        queue.filters.ffmpeg.toggle(queue.filters.ffmpeg.getFiltersEnabled());
        await interaction.reply("Setting the filters back to default");
        break;
      case "enabled":
        // gives a list of all the enabled commands
        await interaction.reply(
          queue.filters.ffmpeg.getFiltersEnabled().length > 0
            ? {
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Here's a list of all the enabled filters!")
                    .setDescription(
                      queue.filters.ffmpeg.getFiltersEnabled().join("\n")
                    )
                    .setColor(0x39ffef),
                ],
              }
            : "🚫 There are no filters currently enabled!"
        );
        break;
      default:
        // list all the filters
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Here's a list of all the filters:`)
              .setDescription(filters.sort().join("\n"))
              .setColor(0xe50000),
          ],
        });
    }
  },
};
