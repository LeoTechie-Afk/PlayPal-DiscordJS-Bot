const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("audioTrackAdd", async (queue, track) => {
  // Emitted when the player adds a single song to its queue
  try {
    await queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6666ff)
          .setThumbnail(track.raw.thumbnail.url)
          .setTitle("✅ Added to queue")
          .setDescription(`[${track.title} added to the queue](${track.url})`)
          .addFields([
            { name: "Requested by", value: `<@${track.requestedBy.id}>` },
            { name: "Duration", value: `${track.duration}` },
          ]),
      ],
    });
  } catch (error) {
    console.log(error);
  }
});
