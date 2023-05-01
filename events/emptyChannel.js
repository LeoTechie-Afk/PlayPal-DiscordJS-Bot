const { useMasterPlayer } = require("discord-player");
const player = useMasterPlayer();

module.exports = player.events.on("emptyChannel", (queue) => {
  // Emitted when the voice channel has been empty for the set threshold
  // Bot will automatically leave the voice channel with this event
  queue.channel.metadata.send(`Voice channel empty! Leaving 👋🏻`);
});
