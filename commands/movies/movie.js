const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { imdbApiKey } = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("movie")
    .setDescription("Looks up a movie on IMDb")
    .addStringOption((option) =>
      option
        .setName("movie_name")
        .setDescription("The movie name you want to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    const movie_name = interaction.options.getString("movie_name");

    let message = ``;

    const response = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/` + movie_name
    );

    const myJson = await response.json();

    if (myJson.results.length != 0) {
      for (let i = 0; i < 5; i++) {
        const r = myJson.results[i];
        message += `${parseInt(i) + 1} - [${
          r.title
        }](https://www.imdb.com/title/${r.id})\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle("BEEP-BOOP here's your result!")
        .setDescription(message)
        .setColor(0x6666ff)
        .setThumbnail(myJson.results[0].image)
        .addFields({
          name: "Requested by",
          value: `<@${interaction.user.id}>`,
          inline: true,
        });

      await interaction.reply({ embeds: [embed] });
      return;
    } else {
      await interaction.reply(
        "I'm not quite sure I understand, can you repeat again?",
        { ephemeral: true }
      );
    }
  },
};
