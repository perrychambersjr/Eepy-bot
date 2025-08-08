const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const categories = ['Funny', 'Performance', 'Personality', 'Other']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-award')
        .setDescription('Creates a new Eepy-Award.'),
    async execute(interaction){

        const row = new ActionRowBuilder()

        categories.forEach(cat => {
            let categoryButton = new ButtonBuilder()
                .setCustomId(cat)
                .setLabel(cat)
                .setStyle(ButtonStyle.Primary)
                
            row.addComponents(categoryButton)
        })

        await interaction.reply({
            content: 'Select a category',
            components: [row],
        })

    }
}