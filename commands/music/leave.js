const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the channel the bot is in"),
  async execute(interaction) {
    // getting connection
    const guildId = interaction.guild.id;
    const connection = getVoiceConnection(guildId);

    // gets member id and bot's current id
    const memberVoiceId = interaction.member.voice.channel.id;
    const clientVoiceId = connection.joinConfig.channelId;

    // if the bot is not connected returns an error message
    if (!connection) {
      await interaction.reply("Bot not in a voice channel! ");
      return;
      // if the bot is not in the same channel as the user returns error
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

    // stops the player to avoid any memory leaks
    interaction.client.player.stop();

    await interaction.reply({ embeds: [embed] });
  },
};
