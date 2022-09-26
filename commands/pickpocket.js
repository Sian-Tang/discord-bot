const { currency } = require('../main.js');
const { Users, CurrencyShop } = require('../dbObjects');
const min_amount = 50;
const Discord = require('discord.js');
const gif = new Discord.MessageEmbed().setImage('https://media.giphy.com/media/Yx2CF2aeN87ug/giphy.gif');
const gif2 = new Discord.MessageEmbed().setImage('https://media.giphy.com/media/dAiL3iIK49WNxPz2J3/giphy.gif');
const gif3 = new Discord.MessageEmbed().setImage('https://media.giphy.com/media/utO4QxTbV3Us/giphy.gif');

function sleep (time){
    return new Promise((resolve) => setTimeout(resolve,time));
}

module.exports = {
    name: 'pickpocket',
    description: "steal money from others",
    execute(message,args){

        /* get target */
        const transferTarget = message.mentions.users.first();

        if(transferTarget === undefined) return message.channel.send(`${message.author}, your target doesn't exist!`);

        /* get balance from author */
        const currentAmount = currency.getBalance(message.author.id);
        const targetAmount = currency.getBalance(transferTarget.id);

        /* get amount */
        const transferAmount = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));

        /* check if transfer argument is valid */
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        /* check if user has enough credit */
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}💰.`);
        /* check if target has enough credits */
        if (transferAmount > targetAmount) return message.channel.send(`${transferTarget} only has ${targetAmount}💰 to steal from`);
        /* check if negative transfer argument was passed */
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
        /* target is too poor */
        if (targetAmount < min_amount || targetAmount - transferAmount < min_amount){
            
            (async () => {
                message.channel.send(gif3);
                await sleep(1500);
                message.channel.bulkDelete(1);
                await sleep(500);
                message.channel.send(`At least leave ${transferTarget} with ${min_amount}💰 to eat and drink! You can steal up to ${targetAmount-min_amount}💰 from ${transferTarget}!`);
                return message.channel.send(`Mama told you not to steal from the poor. Especially bums like ${transferTarget}!`);
            })();

        } else {
            const event = Math.floor(Math.random() * 2);


            if(event % 2){
                message.channel.send(gif2);
    
                sleep(1500).then(() => {
                    message.channel.bulkDelete(1);
                      /* update balance of user and target */
                    currency.add(message.author.id, -transferAmount);
                    currency.add(transferTarget.id, +transferAmount);
        
                    return message.channel.send(`${transferTarget} stole your 💰! Your current balance is ${currency.getBalance(message.author.id)}💰`);
            
                });
            
            } else {
    
                message.channel.send(gif)
    
                sleep(2000).then(() => {
                    message.channel.bulkDelete(1);
                    /* update balance of user and target */
                    currency.add(message.author.id, +transferAmount);
                    currency.add(transferTarget.id, -transferAmount);
    
                   return message.channel.send(`You successfully stole ${transferAmount}💰 from ${transferTarget}! Your current balance is ${currency.getBalance(message.author.id)}💰`)
    
                });
            }
        }  
    }
}
