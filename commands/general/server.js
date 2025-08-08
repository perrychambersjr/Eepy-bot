const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Show your current points'),

  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });

    if (!user) {
      user = new User({ userId: interaction.user.id, points: 0 });
      await user.save();
    }

    await interaction.reply(`You have ${user.points} points.`);
  }
};