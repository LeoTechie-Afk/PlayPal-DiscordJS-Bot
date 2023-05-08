const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer, QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search a song on youtube by keyword.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The name of the song you want to play.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const player = useMasterPlayer(); // Get the player instance that we created earlier
    await player.extractors.loadDefault();
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply("🚫 You are not connected to a voice channel!"); // make sure we have a voice channel
    if (interaction.member.voice.selfDeaf)
      return interaction.reply("🎧 You need to be unmuted to play a song.");
    // if (channel != player.voiceUtils.getConnection(interaction.guild.id)) {
    //   player.voiceUtils.join(channel, { deaf: true });
    //   interaction.followUp("Switching channel! 😎");
    // }

    const query = interaction.options.getString("query"); // we need input/query to play

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
          nodeOptions: {
            metadata: interaction, // can be accessed with queue.metadata
            selfDeaf: true,
            volume: 80,
            leaveOnEnd: false,
            leaveOnEmpty: true,
            onBeforeCreateStream: async (track, _source, _queue) => {
              return ytdl(
                track.url.includes("youtube.com")
                  ? track.url
                  : (
                      await Youtube.searchOne(
                        `${track.title} by ${track.author} lyrics`
                      )
                    ).url,
                { filter: "audioonly" }
              );
            },
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
