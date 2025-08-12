/*
command to configure the create-award command
currently checks to see if any new categories have been added,
and adds them to the DB
*/

const { SlashCommandBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid')

const Category = require('../../models/Category')

const categories = ['Funny', 'Performance', 'Personality', 'Other']

async function findExisting(category) {
    let cat = await Category.findOne({category: category})
    if (!cat){    
        cat = new Category({
            categoryId: uuidv4(),
            category: category})
        await cat.save()
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('award-config')
        .setDescription('Configure the award command.'),
    async execute(interaction) {
  
        categories.forEach(cat => {
            findExisting(cat)
        })

        await interaction.reply({ 
            content: 'create-award command has been configured.'})
    }
}

