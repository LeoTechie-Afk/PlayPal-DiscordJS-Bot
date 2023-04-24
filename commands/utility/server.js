const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server"),
  async execute(interaction) {
    await interaction.reply(
      `This command was run in the guild ${interaction.guild.name}, with member count: ${interaction.guild.memberCount}`
    );
  },
};
