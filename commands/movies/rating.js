const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rating")
    .setDescription(
      "Returns the rating of a movie across all rating sites such as IMDb, Rotten Tomatoes and Metacritic"
    ),
  async execute(interaction) {
    // TO-DO code
    await interaction.reply("");
  },
};
