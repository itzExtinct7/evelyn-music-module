const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Deezer = require("erela.js-deezer");
const Apple = require("better-erela.js-apple").default;
const Spotify = require("better-erela.js-spotify").default;
const { Manager } = require("erela.js");

const { GuildVoiceStates } = GatewayIntentBits;
const { User, Message, Channel, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [GuildVoiceStates],
  partials: [User, Message, Channel, GuildMember, ThreadMember],
});

client.config = require("./config.json");

const { loadErela } = require("./handlers/erela.js");
const { loadButtons } = require("./handlers/buttons.js");

client.manager = new Manager({
  nodes: client.config.nodes,
  plugins: [
    new Spotify({
      clientID: client.config.spotifyClientID,
      clientSecret: client.config.spotifySecret,
    }),
    new Apple(),
    new Deezer(),
  ],
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = client;

client.login(client.config.token).then(() => {
  loadErela(client);
  loadButtons(client);
});
