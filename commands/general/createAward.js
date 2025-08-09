const { SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle } = require('discord.js')

const categories = ['Funny', 'Performance', 'Personality', 'Other']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-award')
        .setDescription('Creates a new Eepy-Award.'),
    async execute(interaction){

        const row = new ActionRowBuilder()

        //add each category button
        categories.forEach(cat => {
             let categoryButton = new ButtonBuilder()
                 .setCustomId(cat)
                 .setLabel(cat)
                 .setStyle(ButtonStyle.Primary)
                
             row.addComponents(categoryButton)
         })



        await interaction.reply({
            content: 'Select a Category:',
            components: [row]
        })

        const msg = await interaction.fetchReply()

        const buttonCollector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000,
            filter: i => i.user.id === interaction.user.id
        })

        buttonCollector.on('collect', async buttonClick => {
            const chosenCategory = buttonClick.customId;

            // Stop listening after one click
            buttonCollector.stop();

            // Show modal to collect award title
            const modal = new ModalBuilder()
                .setCustomId(`awardModal-${chosenCategory}`)
                .setTitle('Enter Award Title')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('awardTitle')
                            .setLabel(`Award Title for ${chosenCategory}`)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );

            await buttonClick.showModal(modal);
        })

         buttonCollector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({
                    content: 'No category selected in time.',
                    ephemeral: true
                });
            }
        })

    }
}