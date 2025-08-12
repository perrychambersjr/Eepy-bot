const { SlashCommandBuilder } = require('discord.js');
const Event = require('../../models/Event');
const eventDetails = require('../../config/event-creation/eventDetails.json');

/**
 * Returns a SlashCommandBuilder object of a custom command created from eventDetails.json file
 */
function buildCreateEventCommand() {
  const command = new SlashCommandBuilder()
    .setName('new-event')
    .setDescription('Create a new event of a specific game.');

  for (const [id, details] of Object.entries(eventDetails)) {
    command.addSubcommand(sub => {
      sub.setName(id).setDescription(details.description || details.name || id);

      // cover each possible type option in json file
      (details.options || []).forEach(optConfig => {
        const required = Boolean(optConfig.required);
        switch (optConfig.type) {
          case 'string':
            sub.addStringOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          case 'integer':
            sub.addIntegerOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          case 'choice':
            sub.addStringOption(opt => {
              let builder = opt.setName(optConfig.name)
                               .setDescription(optConfig.description || '')
                               .setRequired(required);
              if (Array.isArray(optConfig.choices)) {
                builder = builder.addChoices(
                  ...optConfig.choices.map(c => ({ name: c, value: c }))
                );
              }
              return builder;
            });
            break;

          case 'boolean':
            sub.addBooleanOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          case 'user':
            sub.addUserOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          case 'role':
            sub.addRoleOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          case 'channel':
            sub.addChannelOption(opt =>
              opt.setName(optConfig.name)
                 .setDescription(optConfig.description || '')
                 .setRequired(required)
            );
            break;

          default:
            // unknown type — ignore or log
            console.warn(`Unknown option type "${optConfig.type}" for ${id}.${optConfig.name}`);
        }
      });

      return sub;
    });
  }

  return command;
}

async function createEventFromInteraction(interaction) {
  const eventType = interaction.options.getSubcommand();
  const config = eventDetails[eventType];
  if (!config) throw new Error(`Unknown event type: ${eventType}`);

  // pull all option values according to config.options
  const eventData = {};
  for (const opt of config.options || []) {
    let val;
    switch (opt.type) {
      case 'integer':
        val = interaction.options.getInteger(opt.name);
        break;
      case 'boolean':
        val = interaction.options.getBoolean(opt.name);
        break;
      case 'user':
        val = interaction.options.getUser(opt.name)?.id ?? null;
        break;
      case 'role':
        val = interaction.options.getRole(opt.name)?.id ?? null;
        break;
      case 'channel':
        val = interaction.options.getChannel(opt.name)?.id ?? null;
        break;
      default: // string, choice, etc.
        val = interaction.options.getString(opt.name);
    }
    eventData[opt.name] = val ?? null;
  }

  // Map fields into your Event model schema (keep same keys you used before)
  const newEvent = new Event({
    guildId: interaction.guildId,
    createdBy: interaction.user.id,
    type: eventType,
    title: eventData.title,
    description: eventData.description || null,
    date: eventData.date ? new Date(eventData.date) : null,
    difficulty: eventData.difficulty || null,
    location: eventData.location || null,
    gearRequirements: eventData.gear_requirements || null,
    level: eventData.level || null,
    defaultRoles: config.defaultRoles || [],
    maxPlayers: config.maxPlayers ?? null,
    signups: []
  });

  await newEvent.save();
  return { newEvent, config };
}

module.exports = {
  buildCreateEventCommand,
  createEventFromInteraction
};