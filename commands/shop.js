const { Users, CurrencyShop } = require('../dbObjects');
const { currency } = require('../app.js');

module.exports = {
    name: 'shop',
    description: "shows shop",
    execute: async (message) => {

        /* get all shop items */
        const items = await CurrencyShop.findAll();
        /* print shop items */
        return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
        

    }
}