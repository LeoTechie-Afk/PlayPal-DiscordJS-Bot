const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { QueryType, useMasterPlayer } = require("discord-player");
const ytdl = require("ytdl-core");
const Youtube = require("youtube-sr");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from either Soundcloud, Spotify or Youtube.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(
          "The name or the link to the resource you want to play."
        )
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const player = useMasterPlayer(); // Get the player instance that we created earlier
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply("🚫 You are not connected to a voice channel!"); // make sure we have a voice channel
    if (interaction.member.voice.selfDeaf)
      return interaction.reply("🎧 You need to be unmuted to play a song.");

    const query = interaction.options.getString("query");
    let queryType;

    await interaction.deferReply();

    if (query.includes("open.spotify.com/playlist"))
      queryType = QueryType.SPOTIFY_PLAYLIST;
    else if (query.includes("open.spotify.com/album"))
      queryType = QueryType.SPOTIFY_ALBUM;
    else if (query.includes("open.spotify.com/track"))
      queryType = QueryType.SPOTIFY_SONG;
    else if (
      query.includes("list") &&
      (query.includes("youtube.com") || query.includes("youtu.be"))
    )
      queryType = QueryType.YOUTUBE_PLAYLIST;
    else if (query.includes("youtube.com") || query.includes("youtu.be"))
      queryType = QueryType.YOUTUBE_VIDEO;
    else if (query.includes("soundcloud.com/playlist"))
      queryType = QueryType.SOUNDCLOUD_PLAYLIST;
    else if (query.includes("soundcloud.com"))
      queryType = QueryType.SOUNDCLOUD_TRACK;
    else queryType = QueryType.YOUTUBE_SEARCH;

    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: queryType,
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
            skipOnNoStream: true,
            defaultFFmpegFilters: ["normalizer"],
            // onBeforeCreateStream: async (track, _source, _queue) => {
            //   return track.url.includes("youtube.com")
            //     ? ytdl(track.url, { filter: "audioonly" })
            //     : ytdl(
            //         (
            //           await Youtube.searchOne(
            //             `${track.title} by ${track.author} lyrics`
            //           )
            //         ).url,
            //         { filter: "audioonly" }
            //       );
            // },
          },
        });

        console.log(player.scanDeps());

        await interaction.editReply(`Loading your track`);
      } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`);
      }
    }
  },
};
