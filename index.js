```
const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { TOKEN, CHANNEL_ID } = process.env;

// Roles
const ROLES = {
  TRAP_1: "<@&1462315632019247156>",
  TRAP_2: "<@&1462315838093791423>",
  ARENA: "<@&1466790142927962238>",
};

// Commands map
const COMMANDS = {
  "!ping": "🏓 Pong !",
  "!prax": "Take a beer with me my friend!",
  "!elainae": "My mistress is the best woman I know, I love her",
  "!gk": "Everyone kneel down to our queen, GoKart",
  "!cheezy": "Soon, *OUR* Cheezy",
  "!beer": "Take a FST beer my dear friend !",
};

let channelCache = null;

// Safely get channel
async function getChannel() {
  if (channelCache) return channelCache;

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) throw new Error("Channel not found");
    channelCache = channel;
    return channel;
  } catch (err) {
    console.error("❌ Failed to fetch channel:", err.message);
    return null;
  }
}

// Scheduler helper
function scheduleMessage(cronTime, message) {
  cron.schedule(
    cronTime,
    async () => {
      const channel = await getChannel();
      if (!channel) return;

      try {
        await channel.send(message);
      } catch (err) {
        console.error("❌ Failed to send message:", err.message);
      }
    },
    { timezone: "Europe/Paris" }
  );
}

client.once("ready", async () => {
  console.log(`✅ Connected as ${client.user.tag}`);

  const channel = await getChannel();
  if (channel) {
    console.log(`📨 Target channel: ${channel.name}`);
  }

  // Schedules
  scheduleMessage(
    "15 21 1-31/2 * *",
    `${ROLES.TRAP_1} 15 minutes before losing to trap 2, beep boop`
  );

  scheduleMessage(
    "15 11 2-30/2 * *",
    `${ROLES.TRAP_2} 15 minutes before bear hunt to beat trap 1, beep boop`
  );

  scheduleMessage(
    "30 1 * * *",
    `${ROLES.ARENA} Beep Boop Arena reminder !`
  );

  scheduleMessage(
    "0 22 * * *",
    `${ROLES.ARENA} Beep Boop Arena reminder ! 4 hours before reset`
  );
});

// Commands
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().toLowerCase();

  // Special command
  if (content === "!ping arena") {
    const channel = await getChannel();
    if (channel) {
      await channel.send(`${ROLES.ARENA} Beep Boop Arena reminder ! (test)`);
    }
    return;
  }

  // Generic commands
  if (COMMANDS[content]) {
    await message.reply(COMMANDS[content]);
  }
});

client.login(TOKEN);
```
