const requests = require('requests');
const Discord = require('discord.js');

module.exports = {
    name: "player",
    description: "Player Stats",
    execute(message, args) {
        let [player, platform] = args;
        if (!player) {
            message.channel.send("Please specify a player name");
            return;
        }
        if (!platform) {
            message.channel.send("Please specify platform - PC, PS4, X1");
            return;
        }

        let url =  `https://api.mozambiquehe.re/bridge?auth=${process.env.APEX_TOKEN}&player=${player}&platform=${platform}`;
        requests(url)
        .on('data', chunk => {
            let data = JSON.parse(chunk);
            if(data.Error) return message.channel.send(data.Error);

            try{
                let embed = new Discord.MessageEmbed()
                .setTitle(`${data.global.name}`)
                .setColor('BLACK')
                .setThumbnail(data.legends.selected.ImgAssets.icon.replace(' ','%20'))
                .setImage(data.legends.selected.ImgAssets.banner.replace(' ','%20'))
                .addField("Level", `${data.global.level}`, true)
                .addField("BR Rank", data.global.rank.rankName + ' ' + data.global.rank.rankDiv, true)
                .addField("Arena Rank", data.global.arena.rankName + ' ' + data.global.arena.rankDiv, true)
                .addField(data.legends.selected.data[0] ? data.legends.selected.data[0].name : '\u200B', data.legends.selected.data[0] ? `${data.legends.selected.data[0].value}` : '\u200B', true)
                .addField(data.legends.selected.data[1] ? data.legends.selected.data[1].name : '\u200B', data.legends.selected.data[1] ? `${data.legends.selected.data[1].value}` : '\u200B', true)
                .addField(data.legends.selected.data[2] ? data.legends.selected.data[2].name : '\u200B', data.legends.selected.data[2] ? `${data.legends.selected.data[2].value}` : '\u200B', true)
                .addField('Badge #1',data.legends.selected.gameInfo.badges[0].name ? data.legends.selected.gameInfo.badges[0].name : 'Not set', true)
                .addField('Badge #2',data.legends.selected.gameInfo.badges[1].name ? data.legends.selected.gameInfo.badges[1].name : 'Not set', true)
                .addField('Badge #3',data.legends.selected.gameInfo.badges[2].name ? data.legends.selected.gameInfo.badges[2].name : 'Not set', true)
                .setFooter({text: `${data.global.uid}`})
                message.channel.send({embeds: [embed]});
            }catch(err){
                console.log(err);
                message.channel.send('err: ' + err);
            }
        })
        .on('end', (err)=> {
            if (err) {
                message.channel.send("Error Occurred, check logs.");
                return console.log('connection closed due to errors', err);
            }
        });
    }
}