const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("audioTracksAdd", (queue, track) => {
  // Emitted when the player adds multiple songs to its queue
  queue.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x6666ff)
        .setThumbnail(track.raw.thumbnail.url)
        .setTitle("✅ Added to queue")
        .setDescription(`[Multiple tracks added to the queue](${track.url})`)
        .addFields([
          { name: "Requested by", value: `<@${track.requestedBy.id}>` },
          { name: "Duration", value: `${track.duration}` },
        ]),
    ],
  });
});
