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
    // shows "bot is thinking" so it doesn't timeout
    await interaction.deferReply();

    const movie_name = interaction.options.getString("movie_name");

    let message = ``;

    const response = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/` + movie_name
    );

    const myJson = await response.json();

    if (myJson.results.length != 0) {
      // only displays the first 5 results or less
      for (let i = 0; i < 5 && i < myJson.results.length; i++) {
        // result json object at i
        const r = myJson.results[i];

        // creates message for title at i with embed link to it
        message += `${parseInt(i) + 1} - [${
          r.title
        }](https://www.imdb.com/title/${r.id})\n`;
      }

      // message to display
      const embed = new EmbedBuilder()
        .setTitle("🎞️ BEEP-BOOP here's your result!")
        .setDescription(message)
        .setColor(0x6666ff)
        .setThumbnail(myJson.results[0].image)
        .addFields({
          name: "Requested by",
          value: `<@${interaction.user.id}>`,
          inline: true,
        });

      // edits the reply with the embed created before
      await interaction.editReply({ embeds: [embed] });
      return;
    } else {
      // in case there was no result to the search displays this message
      await interaction.editReply("I'm not quite sure that exists 🤔", {
        ephemeral: true,
      });
    }
  },
};
