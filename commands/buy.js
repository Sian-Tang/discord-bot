const { currency } = require('../app.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');

module.exports = {
    name: 'buy',
    description: "buy item from shop",
    execute: async (message,args) => {

        /* get item name from args and search if item exist in shop */
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        /* invalid item name */
        if (!item) return message.channel.send(`That item doesn't exist.`);

        /* not enough currency to buy item */
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}💰, but the ${item.name} costs ${item.cost}💰!`);
        }

        if (item.name === 'Bill Gates'){
            /* get all items from shop */
            const items = await CurrencyShop.findAll();
            const items_names = items.map(i => i.name);
            /* get items from user. item_amount is amount of each item user has */
            const my_items = await user.getItems();
            const my_item_amount = my_items.map(i => i.amount);
            const my_item_name = my_items.map(i => i.item.name);  

            /* check if special item is already in possession */
            if(my_item_name.includes(item.name) && my_item_amount[my_item_name.indexOf(item.name)] > 0){
                return message.channel.send(`You already have ${item.name}!`);
            }

            /* iterate every item */
            for(i = 0; i < items_names.length-1;i++){
                
                /* check if all item names are listed in inventory */
                if(my_item_name.length < items_names.length-1) {
                    return message.channel.send(`You need all other items available in the shop in order to buy ${item.name}`);
                }

                /* check if my_item exist in shop and check if amount is at least 1 */
                if( !(items_names.includes(my_item_name[i]) && my_item_amount[i] > 0) ){
                    return message.channel.send(`You need at least 1 of each item in order buy ${item.name}`);
                }

            }
        } 

         /* update balance and add item to inventory */
         currency.add(message.author.id, -item.cost);
         await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}! Your new balance is: ${currency.getBalance(message.author.id)}💰!`);
    }
}