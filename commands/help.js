const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Help command",
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setColor('BLACK')
            .addField(";help", "Shows this message")
            .addField(";map", "Shows the current map rotation")
            .addField(";craft / ;crafting", "Shows the current crafting rotation")
            .addField(";store", "Shows the current store rotation")
            .addField(";news", "Shows the current news")
            .addField(";servers", "Shows the current status of servers")
            .addField(";chat", "Chat with AI")
            .addField(";player <Username> <Platform>", "Shows the stats of a player")

        message.channel.send({embeds: [embed]});
    }
}