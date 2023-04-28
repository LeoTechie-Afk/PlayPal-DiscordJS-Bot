const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the channel the bot is in"),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    const memberVoiceId = interaction.member.voice.channel.id;
    const clientVoiceId = connection.joinConfig.channelId;
    console.log(connection);

    if (!connection) {
      await interaction.reply("Bot not in a voice channel! ");
      return;
    } else if (clientVoiceId != memberVoiceId) {
      await interaction.reply("User and bot are not in the same channel.");
      return;
    }

    connection.destroy();

    const embed = new EmbedBuilder()
      .setTitle(`🎶 Leaving channel!`)
      .setColor(0x6666ff)
      .addFields({
        name: "Requested by",
        value: `<@${interaction.user.id}>`,
        inline: true,
      });

    await interaction.reply({ embeds: [embed] });
  },
};
