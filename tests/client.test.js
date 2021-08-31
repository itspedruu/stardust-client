const {Client} = require('../lib');

require('dotenv').config();

// redundant use because they use the same key name for the environment variable. 
// this is used to show devs how to use the setup
Client.setup(process.env.STARDUST_API_KEY);

test('Get Game', async () => {
	const game = await Client.getGame();

	expect(game).toHaveProperty('name');
});

test('Get Health', async () => {
	const health = await Client.getHealth();

	expect(health).toHaveProperty('status');
});

test('Get Open API', async () => {
	const endpoints = await Client.getEndpoints();

	expect(endpoints).toHaveProperty('paths');
});