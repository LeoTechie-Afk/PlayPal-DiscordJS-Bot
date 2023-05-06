const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { imdbApiKey } = require("../../config.json");

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
    // shows "bot is thinking" so it doesn't timeout
    await interaction.deferReply();
    const tvshow_name = interaction.options.getString("tvshow_name");

    let message = ``;

    const response = await fetch(
      `https://imdb-api.com/en/API/SearchSeries/${imdbApiKey}/` + tvshow_name
    );

    const myJson = await response.json();

    if (myJson.results.length != 0) {
      // only displays the first 5 results or less
      for (let i = 0; i < 5 && myJson.results.length; i++) {
        const r = myJson.results[i];
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
    } else {
      // in case there was no result to the search displays this message
      await interaction.editReply(
        `I'm not quite sure I understand, can you repeat again? <@${interaction.user.id}>`,
        { ephemeral: true }
      );
    }
  },
};
