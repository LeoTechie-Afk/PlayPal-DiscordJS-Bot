const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription(
      "Responds with the avatar of the user that ran the command"
    ),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setImage(getUserAvatar(interaction.user.id, interaction.user.avatar))
          .setTitle("Here's your avatar!"),
      ],
    });
  },
};

const getUserAvatar = (userId, userAvatar) => {
  return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.jpeg`;
};
