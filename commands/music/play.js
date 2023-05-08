const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Plays a song using an url from either Soundcloud, Spotify or Youtube."
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("spotify")
        .setDescription("Plays a song from spotify")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url of the song you want to play.")
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("ytb")
        .setDescription("Plays a song from Youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url of the song you want to play.")
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("soundcloud")
        .setDescription("Plays a song from Soundcloud")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The url of the song you want to play.")
            .setRequired(true)
        )
    ),
  /**
   *
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const player = useMasterPlayer(); // Get the player instance that we created earlier
    await player.extractors.loadDefault();
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply("🚫 You are not connected to a voice channel!"); // make sure we have a voice channel
    if (interaction.member.voice.selfDeaf)
      return interaction.reply("🎧 You need to be unmuted to play a song.");

    const query = interaction.options.getString("url");
    let queryType;

    switch (interaction.options._subcommand) {
      case "spotify":
        if (query.includes) queryType = QueryType.SPOTIFY;
        break;
      case "ytb":
        break;
      // soundcloud
      default:
        break;
    }
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });

    if (!searchResult.hasTracks()) {
      // If player didn't find any songs for this query
      await interaction.editReply(`We found no tracks for ${query}!`);
      return;
    } else {
      try {
        await player.play(channel, searchResult, {
          nodeOptions: {
            metadata: interaction, // can be accessed with queue.metadata
            selfDeaf: true,
            leaveOnEnd: false,
            leaveOnEmpty: true,
          },
        });

        await interaction.editReply(`Loading your track`);
      } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`);
      }
    }
  },
};
