const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')

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

        const buttonClick = await interaction.channel.awaitMessageComponent({
            filter: i => categories.includes(i.customId),
            componentType: ComponentType.Button,
            time: 30000
        }).catch(() => null)

        if (!buttonClick) return interaction.followUp({content: 'No category selected.'})

        const chosenCategory = buttonClick.customId
        await buttonClick.update({ 
            content: `You selected ${chosenCategory}.`,
        components: []})

    }
}