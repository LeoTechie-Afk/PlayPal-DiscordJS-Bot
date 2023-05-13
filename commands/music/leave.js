const { useMasterPlayer, useQueue, voiceUtils } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the channel the bot is in"),
  async execute(interaction) {
    const player = useMasterPlayer();
    const guildId = interaction.guild.id;

    const queue = useQueue(guildId);

    if (!queue) return await interaction.reply("Bot not in a voice channel!");

    // gets member id and bot's current voice id
    console.log(queue);
    const connection = queue.channel.id;
    console.log(connection);
    const memberVoiceId = interaction.member.voice.channel.id;

    // if the bot is not connected returns an error message
    if (!connection) return interaction.reply("Bot not in a voice channel! ");
    if (connection != memberVoiceId)
      return interaction.reply("User and bot are not in the same channel.");

    // Stops the queue
    player.destroy();

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
