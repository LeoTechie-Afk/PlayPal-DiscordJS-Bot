const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("audioTrackAdd", (queue, track) => {
  // Emitted when the player adds a single song to its queue
  try {
    queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6666ff)
          .setThumbnail(track.thumbnail)
          .setTitle("✅ Added to queue")
          .setDescription(`[${track.title} added to the queue](${track.url})`)
          .addFields([
            {
              name: "Requested by",
              value: `<@${track.requestedBy.id}>`,
            },
            { name: "Duration", value: `${track.duration}` },
          ])
          .setTimestamp(new Date().getTime()),
      ],
    });
  } catch (error) {
    console.log(error);
  }
});
