const { currency } = require('../main.js');

module.exports = {
    name: 'balance',
    description: "this is a balance command",
    async execute(message){

        /* get target */
        const target = message.mentions.users.first() || message.author;
        /* call getBalance and print it */
		return message.channel.send(`${target.tag} hat ${currency.getBalance(target.id)}💰`);

    }
}
