const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Toss a coin!"),
  async execute(interaction) {
    let file;
    const embed = new EmbedBuilder()
      .setImage("https://media.tenor.com/bd3puNXKLwUAAAAC/coin-toss.gif")
      .setColor(0x6666ff)
      .setTitle("Tossing a coin...")
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    await sleep(2000);

    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      file = new AttachmentBuilder("assets\\head.png");
      embed
        .setImage("attachment://head.png")
        .setTitle(`The result was head! 🪙`);
    } else {
      file = new AttachmentBuilder("assets\\tails.png");
      embed
        .setImage("attachment://tails.png")
        .setTitle(`The result was tails! 🦅`);
    }

    await interaction.editReply({ embeds: [embed], files: [file] });
  },
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
