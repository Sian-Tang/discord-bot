const { currency } = require('../app.js');
const { Users, CurrencyShop } = require('../dbObjects');

/* function to check if value, given as string, is positive integer */
function isNumeric(value){
    return /^\d+$/.test(value);
}

module.exports = {
    name: 'transfer',
    description: "transfers #amount credits to @user",
    execute(message,args){

        /* get balance from author */
        const currentAmount = currency.getBalance(message.author.id);
        /* get amount, if valid, from args */
        var transferAmount = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        /* option to transfer all credits to @target */
        if(transferAmount == 'alles'){
            transferAmount = currentAmount;
        }

        /* get target */
        const transferTarget = message.mentions.users.first();

        if(transferTarget === undefined) return message.channel.send(`${message.author}, your target does not exist!`);

        /* check if transfer argument is valid */
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        /* check if user has enough credit */
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
        /* check if negative transfer argument was passed */
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        /* update balance of user and target */
        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, +transferAmount);

        /* transfer successful */
        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);

    }
}