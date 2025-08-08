# Eepy-bot
Discord bot made with discord.js.

# To get started:
Create a .env file. Add in 3 fields:
DISCORD_TOKEN,
GUILD_ID,
CLIENT_ID.

All 3 of these can be found on the developer portal for the bot.

Command loading:
On startup, index.js loops through commands folders and registers the exported js modules as commands on the server. This must be done for new commands to show up when you use "/".