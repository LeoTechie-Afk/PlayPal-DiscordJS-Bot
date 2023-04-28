const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the channel"),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply("User not in voice channel! ");
      return;
    }
    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const embed = new EmbedBuilder()
      .setTitle(`🎶 Joining channel ${voiceChannel.name}!`)
      .setColor(0x6666ff)
      .addFields({
        name: "Requested by",
        value: `<@${interaction.user.id}>`,
        inline: true,
      });

    // voiceConnection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
    //   console.log("Connection is in the Ready state!");
    // });

    await interaction.reply({ embeds: [embed] });
  },
};
