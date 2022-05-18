const requests = require('requests');

module.exports = {
    name: "chat",
    description: "Chat with AI",
    execute(message, args) {
        if(args.length < 1) return message.channel.send('Please provide a message to chat with AI.');

        let url =  `https://some-random-api.ml/chatbot?key=${process.env.CHATBOT_TOKEN}&message=${args.join(' ')}`;
        try {
            requests(url)
            .on('data', chunk => {
                let data = JSON.parse(chunk);

                message.channel.send(data.response);
            })
            .on('end', (err)=> {
                if (err) {
                    message.channel.send("Error Occurred, check logs.");
                    return console.log('connection closed due to errors', err);
                }
            });
        } catch (error) {
            message.channel.send("Error Occurred, check logs.");
            console.log(error);   
        }   
    }
}