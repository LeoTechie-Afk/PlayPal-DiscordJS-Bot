const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
const { token } = require("./config.json");

require("dotenv/config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

const player = Player.singleton(client, {
  autoRegisterExtractor: false,
  ytdlOptions: { filter: "audioonly", highWaterMark: 1 << 30, dlChunkSize: 0 },
});

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const joinVoiceChannel = async (voiceChannel) => {
  return new Promise((resolve, reject) => {
    try {
      const voiceConnection = join({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      voiceConnection.on("stateChange", onVoiceConnectionStateChange);

      return resolve(voiceConnection);
    } catch (e) {
      return reject(e);
    }
  });
};

const onVoiceConnectionStateChange = (oldState, newState) => {
  const oldNetworking = Reflect.get(oldState, "networking");
  const newNetworking = Reflect.get(newState, "networking");

  oldNetworking?.off("stateChange", onNetworkStateChange);
  newNetworking?.on("stateChange", onNetworkStateChange);
};

const onNetworkStateChange = (oldNetworkState, newNetworkState) => {
  const newUdp = Reflect.get(newNetworkState, "udp");
  clearInterval(newUdp?.keepAliveInterval);
};

client.login(token);
