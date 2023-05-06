const { useMasterPlayer } = require("discord-player");
const player = useMasterPlayer();

module.exports = player.events.on("disconnect", (queue) => {
  // Emitted when the bot leaves the voice channel
  queue.channel.metadata.send("Looks like my job here is done, leaving now!");
});
