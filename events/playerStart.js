const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

const player = useMasterPlayer();

module.exports = player.events.on("playerStart", (queue, track) => {
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
        ]),
    ],
  });
});
