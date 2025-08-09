require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const connectDB = require('./database');

// connect to MongoDB
connectDB();

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection to store loaded commands
client.commands = new Collection();

// TODO: Put this in a separate file, create a batch startup to run the separate file before index.js
// I.e.,   "scripts": {
//           "run-bot": "node deploy-commands.js && node index.js"
//          }

// Load command files (same way as deploy-commands.js)
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`${command.data.name} command added.`)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Convert to JSON for REST
const commandsJSON = client.commands.map(cmd => cmd.data.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commandsJSON.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandsJSON },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// Ready event
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Slash command interaction handling
client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isModalSubmit()){
        if (interaction.customId.startsWith('awardModal-')) {
            const category = interaction.customId.split('-')[1]
            const awardTitle = interaction.fields.getTextInputValue('awardTitle')

            await interaction.reply({
                content: `Award saved!\nCategory: ${category}\nAward: ${awardTitle}`,
                ephemeral: true
            })
        }
    }

    if (!interaction.isChatInputCommand()) return;


    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const replyOptions = { content: 'There was an error while executing this command!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(replyOptions);
        } else {
            await interaction.reply(replyOptions);
        }
    }
});

// Login
client.login(process.env.DISCORD_TOKEN);