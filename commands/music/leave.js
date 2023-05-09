const { useMasterPlayer, voiceUtils } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the channel the bot is in"),
  async execute(interaction) {
    const player = useMasterPlayer();
    const guildId = interaction.guild.id;
    const connection = player.nodes.get(guildId).connection;
    // gets member id and bot's current id
    const memberVoiceId = interaction.member.voice.channel.id;
    console.log(connection);
    const clientVoiceId = connection;

    // if the bot is not connected returns an error message
    if (!connection) return interaction.reply("Bot not in a voice channel! ");
    if (clientVoiceId != memberVoiceId)
      return interaction.reply("User and bot are not in the same channel.");

    // Stops the queue
    player.destroy();
    // Disconnects the bot
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

    await interaction.reply({ embeds: [embed] });
  },
};
