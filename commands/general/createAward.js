const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, time } = require('discord.js')

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

        // let buttonClick
        // try {
        //     buttonClick = msg.awaitMessageComponent({
        //         filter: i => categories.includes(i.customId) && i.user.id === interaction.user.id,
        //         componentType: ComponentType.Button,
        //         time: 30000
        //     })
        // } catch {
        //     return interaction.followUp({content: 'No category selected in time.'})
        // }

        // const chosenCategory = buttonClick.customId

        // const modal = new ModalBuilder()
        //     .setCustomId(`awardModal-${chosenCategory}`)
        //     .setTitle('Enter Award Title')

        // const awardInput = new TextInputBuilder()
        //     .setCustomId('awardTitle')
        //     .setLabel('Award Title')
        //     .setStyle(TextInputStyle.Short)
        //     .setPlaceholder('e.g, Biggest Pumper')
        //     .setRequired(true)

        // const actionRow = new ActionRowBuilder().addComponents(awardInput)
        // modal.addComponents(actionRow)

        // await buttonClick.showModal(modal)

        // try {
        //     const modalSubmit = await buttonClick.awaitModalSubmit({
        //         filter: i => i.user.id === interaction.user.id,
        //         time: 60000
        //     })

        //     const awardTitle = modalSubmit.fields.getTextInputValue('awardTitle')

        //     await modalSubmit.reply({
        //         content: `Award saved!\nCategory: ${chosenCategory}\nAward: ${awardTitle}`
        //     })
        // } catch {
        //     return interaction.followUp({content: 'Award title not entered in time.'})
        // }

        // const row = new ActionRowBuilder()

        // categories.forEach(cat => {
        //     let categoryButton = new ButtonBuilder()
        //         .setCustomId(cat)
        //         .setLabel(cat)
        //         .setStyle(ButtonStyle.Primary)
                
        //     row.addComponents(categoryButton)
        // })

        // await interaction.reply({
        //     content: 'Select a category',
        //     components: [row],
        // })

        // const buttonClick = await interaction.channel.awaitMessageComponent({
        //     filter: i => categories.includes(i.customId),
        //     componentType: ComponentType.Button,
        //     time: 30000
        // }).catch(() => null)

        // if (!buttonClick) return interaction.followUp({content: 'No category selected.'})

        // const chosenCategory = buttonClick.customId

        // await buttonClick.update({ 
        //     content: `You selected ${chosenCategory}.\nPlease type the award in chat:`,
        //     components: []
        // })




        // const collectedMsg = await interaction.channel.awaitMessages({
        //     filter: m => m.author.id === interaction.user.id,
        //     max: 1,
        //     time: 60000
        // })

        // if (!collectedMsg.size){
        //     return interaction.followUp({ content: 'Award was not entered in time.'})
        // }

        // const awardTitle = collectedMsg.first().content

        // await interaction.followUp({
        //     content: `Award saved!\nCategory: ${chosenCategory}\nAward: ${awardTitle}`
        // })

    }
}