const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const player = useMasterPlayer();

module.exports = player.events.on("audioTracksAdd", (queue, tracks) => {
  // Emitted when the player adds multiple songs to its queue
  try {
    console.log(tracks[0]);
    queue.metadata.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6666ff)
          .setThumbnail(tracks[0].thumbnail)
          .setTitle("✅ Added to queue")
          .setDescription(`Multiple tracks added to the queue`)
          .addFields([
            {
              name: "Requested by",
              value: `<@${tracks[0].requestedBy.id}>`,
              inline: true,
            },
          ])
          .setTimestamp(new Date().getTime()),
      ],
    });
  } catch (error) {
    console.log(error);
  }
});
