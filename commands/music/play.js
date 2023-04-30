const { SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer, QueryType } = require("discord-player");

// TO_DO Add event listener for when a song gets added with an embed

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from youtube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The url or the name of the song you want to play.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const player = useMasterPlayer(); // Get the player instance that we created earlier
    const channel = interaction.member.voice.channel;
    if (!channel)
      return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
    const query = interaction.options.getString("query", true); // we need input/query to play

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
