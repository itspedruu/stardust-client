const {Client, Player} = require('../lib');
const {v4} = require('uuid');

require('dotenv').config();

// redundant use because they use the same key name for the environment variable. 
// this is used to show devs how to use the setup
Client.setup(process.env.STARDUST_API_KEY);

let testUniqueId, testPlayerId;

beforeAll(async () => {
	testUniqueId = v4();

	const player = await Player.create(testUniqueId, {xp: 0});

	testPlayerId = player.playerId;
});

describe('Get Player By Unique Id', () => {
	describe('Forced', () => { // Forced means it creates the user if it doesn't exist
		test('With user data', async () => {
			const uniqueId = v4();

			const user = await Player.get({
				uniqueId,
				force: {
					enabled: true,
					userData: { exp: 0}
				}
			});

			expect(user).toHaveProperty('playerId');
		});

		test('With no user data', async () => {
			const uniqueId = v4();

			const user = await Player.get({
				uniqueId,
				force: {
					enabled: true
				}
			});

			expect(user).toHaveProperty('playerId');
		});
	});

	describe('Not Forced', () => {
		test('Exists', async () => {
			const uniqueId = v4();

			await Player.create(uniqueId);

			const user = await Player.get({uniqueId});

			expect(user).toHaveProperty('playerId');
		});

		test('Not Exists', async () => {
			const uniqueId = v4();
			const user = await Player.get({uniqueId});

			expect(user).toBeFalsy();
		});
	});
});

describe('Get Player By Player Id', () => {
	describe('Forced', () => { // Forced means it creates the user if it doesn't exist
		test('With user data', async () => {
			const playerId = v4();

			const user = await Player.get({
				playerId,
				force: {
					enabled: true,
					userData: { exp: 0}
				}
			});

			expect(user).toHaveProperty('playerId');
		});

		test('With no user data', async () => {
			const playerId = v4();

			const user = await Player.get({
				playerId,
				force: {
					enabled: true
				}
			});

			expect(user).toHaveProperty('playerId');
		});
	});

	describe('Not Forced', () => {
		test('Exists', async () => {
			const uniqueId = v4();
			const createdUser = await Player.create(uniqueId);
			const user = await Player.get({playerId: createdUser.playerId});

			expect(user).toHaveProperty('playerId');
		});

		test('Not Exists', async () => {
			const playerId = v4();
			const user = await Player.get({playerId});

			expect(user).toBeFalsy();
		});
	});
});

describe('Get Inventory', () => {
	test('By Unique Id', async () => {
		const inventory = await Player.getInventory({uniqueId: testUniqueId});

		expect(inventory.length).toBe(0);
	});

	test('By Player Id', async () => {
		const inventory = await Player.getInventory({playerId: testPlayerId});

		expect(inventory.length).toBe(0);
	});
});

describe('Mutate', () => {
	test('By Unique Id', async () => {
		await Player.mutate({uniqueId: testUniqueId, props: {xp: 1}});

		const user = await Player.getByPlayerId(testPlayerId);

		expect(user.userData.xp).toBe(1);
	});

	test('By Player Id', async () => {
		await Player.mutate({playerId: testPlayerId, props: {xp: 2}});

		const user = await Player.getByPlayerId(testPlayerId);

		expect(user.userData.xp).toBe(2);
	});
});