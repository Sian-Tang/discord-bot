const { currency } = require('../main.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
const { UserItems } = require('../models/UserItems.js');

module.exports = {
    name: 'sell',
    description: "sell item from inventory",
    execute: async (message,args) => {

        /* search for item from shop */
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        /* item isn't in shop */
        if (!item) return message.channel.send(`That item doesn't exist.`);


        /* get user's items as object */
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const my_items = await user.getItems();

        /* seperate item object into amount and name */
        const item_amount = my_items.map(i => i.amount );
        const item_name = my_items.map(i => i.item.name);

        /* check if item is in inventory */ 
        if(item_name.includes(item.name)){

            /* check if you have at least 1 of that item */
            if(item_amount[item_name.indexOf(item.name)] == 0){
                return message.channel.send(`You can't sell, because you don't have ${item.name}!`);
            }

            /* update balance and remove item from inventory */
            currency.remove(message.author.id, item.cost);
            await user.sellItem(item);
            

        } else {
            
            /* user does not have item in inventory */
            return message.channel.send(`You can't sell, because you don't have ${item.name}!`);
        
        }
        
        /* successfully sold item */
        message.channel.send(`You've sold: ${item.name}! Your new balance is: ${currency.getBalance(message.author.id)}💰!`);

    }
}


