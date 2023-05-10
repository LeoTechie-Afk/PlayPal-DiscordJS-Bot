const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { ActivityType } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("playerStart", (queue, track) => {
  try {
    // Sets the bot state to the current song
    player.client.user.setActivity(`${track.title}`, {
      type: ActivityType.Listening,
    });

    // Emitted when a songs starts playing
    queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6666ff)
          .setThumbnail(track.raw.thumbnail.url)
          .setTitle("🎶 Now playing")
          .setDescription(`[Started playing ${track.title}](${track.url})`)
          .addFields([
            { name: "Requested by", value: `<@${track.requestedBy.id}>` },
            { name: "Duration", value: `${track.duration}` },
          ])
          .setTimestamp(new Date().getTime()),
      ],
    });
  } catch (error) {
    console.log(error);
  }
});
