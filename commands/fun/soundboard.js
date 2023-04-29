const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { join } = require("node:path");
const fs = require("node:fs");
const {
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} = require("@discordjs/voice");

// TODO: Fix output message (description:30), and double-check sound playing functionality

module.exports = {
  data: new SlashCommandBuilder()
    .setName("soundboard")
    .setDescription("Plays a sound from the soundboard")
    .addStringOption((option) =>
      option
        .setName("sound_name")
        .setDescription("The name of the sound you want to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const soundFolder = join(__dirname, "..", "..", "sounds");
    const soundFiles = fs
      .readdirSync(soundFolder)
      .filter((file) => file.endsWith(".mp3"));

    let description = "Here's a list of all the sounds available\n";
    for (const i of soundFiles) {
      description += `${i + 1} - ${soundFiles[i]}\n`;
    }

    console.log(description);
    const embed = new EmbedBuilder();
    const soundName = interaction.options.getString("sound_name");

    if (!soundFiles.includes(`${soundName}.mp3`)) {
      embed
        .setTitle("Sound not on the list!")
        .setDescription(description)
        .setColor(0x6666ff);
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const guildId = interaction.guild.id;
    let connection = getVoiceConnection(guildId);

    // If not connected connects though the same code that's in the join command
    if (!connection || !connection.channelId) {
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel.id) {
        await interaction.reply("User not in voice channel! ");
        return;
      }
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    const player = interaction.client.player;

    // Plays the resource using ffmpeg's inlineVolume
    const resource = createAudioResource(
      join(__dirname, soundFolder, `${soundName}.mp3`),
      { inlineVolume: true }
    );

    // Tracks any error that the player could face to the console
    player.on("error", (error) => {
      console.error(
        "Error:",
        error.message,
        "with track",
        error.resource.metadata.title
      );
    });

    player.play(resource);

    connection.subscribe(player);

    await interaction.reply("Played audio from soundboard audioname");
  },
};
