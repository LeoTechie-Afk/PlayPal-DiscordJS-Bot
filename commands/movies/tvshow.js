const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { imdbApiKey } = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tvshow")
    .setDescription("Looks up a tv show on IMDb")
    .addStringOption((option) =>
      option
        .setName("tvshow_name")
        .setDescription("The movie name you want to search")
        .setRequired(true)
    ),
  async execute(interaction) {
    const tvshow_name = interaction.options.getString("tvshow_name");

    let message = ``;

    const response = await fetch(
      `https://imdb-api.com/en/API/SearchSeries/${imdbApiKey}/` + tvshow_name
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
    } else {
      await interaction.reply(
        `I'm not quite sure I understand, can you repeat again? <@${interaction.user.id}>`,
        { ephemeral: true }
      );
    }
  },
};
