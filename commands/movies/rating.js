const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { omdbApiKey } = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rating")
    .setDescription(
      "Returns the rating of a movie across all rating sites such as IMDb, Rotten Tomatoes and Metacritic"
    )
    .addStringOption((option) =>
      option
        .setName("moviename")
        .setDescription("The movie name you want to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const moviename = interaction.options
      .getString("moviename")
      .replace(" ", "+");
    const response = await fetch(
      `http://www.omdbapi.com/?t=${moviename}&apikey=${omdbApiKey}`
    );
    const myJson = await response.json();
    console.log(myJson);
    if (myJson.Response != "False") {
      const description = `Release Date: ${myJson.Released}\nRuntime: ${myJson.Runtime}\nGenre: ${myJson.Genre}\nPlot: ${myJson.Plot}\nLanguage: ${myJson.Language}\nCountry: ${myJson.Country}`;

      let fields = [];

      myJson.Ratings.forEach((r) => {
        fields = [...fields, { name: r.Source, value: r.Value, inline: true }];
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎞️ Here's every rating for ${myJson.Title}!`)
        .setDescription(description)
        .setColor(0x6666ff)
        .setThumbnail(myJson.Poster)
        .addFields(fields)
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    await interaction.editReply("I couldn't find what you were looking for 😅");
  },
};
