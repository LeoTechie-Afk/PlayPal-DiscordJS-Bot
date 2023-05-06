const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer, voiceUtils, QueryType } = require("discord-player");
const { YoutubeExtractor } = require("@discord-player/extractor");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from youtube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The name of the song you want to play.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const player = useMasterPlayer(); // Get the player instance that we created earlier
    if (!player.extractors.isRegistered(YoutubeExtractor))
      await player.extractors.register(YoutubeExtractor, {});
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply("🚫 You are not connected to a voice channel!"); // make sure we have a voice channel
    if (interaction.member.voice.selfDeaf)
      return interaction.reply("🎧 You need to be unmuted to play a song.");

    const query = await interaction.options.getString("query"); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();
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
          metadata: interaction.channel,
          selfDeaf: true,
          volume: 100,
          leaveOnEmpty: true,
          leaveOnEnd: false,
        });

        player.scanDeps();

        // await player.play(channel, searchResult, {
        //   nodeOptions: {
        //     metadata: interaction, // can be accessed with queue.metadata
        //     selfDeaf: true,
        //     leaveOnEnd: false,
        //     leaveOnEmpty: true,
        //     skipOnNoStream: true,
        //   },
        // });

        await interaction.editReply(`Loading your track`);
      } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`);
      }
    }
  },
};
