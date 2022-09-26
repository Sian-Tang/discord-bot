const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

	/* shop items */
	const shop = [
		CurrencyShop.upsert({ name: 'Wasserflasche', cost: 5 }),
		CurrencyShop.upsert({ name: 'Teekanne', cost: 10 }),
		CurrencyShop.upsert({ name: 'Bohrmaschine', cost: 20 }),
		CurrencyShop.upsert({ name: 'Auto', cost: 1000}),
		CurrencyShop.upsert({ name: 'Bill Gates', cost: 50000})
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);