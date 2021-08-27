const {Client, Token, Player, Template} = require('../lib');
const {v4} = require('uuid');

require('dotenv').config();

// redundant use because they use the same key name for the environment variable. 
// this is used to show devs how to use the setup
Client.setup(process.env.STARDUST_API_KEY);

let uniqueId, playerId, secondUniqueId, secondPlayerId, templateId, tokenId;

beforeAll(async () => {
	uniqueId = v4();
	secondUniqueId = v4();

	const firstPlayer = await Player.create(uniqueId);
	const secondPlayer = await Player.create(secondUniqueId);

	playerId = firstPlayer.playerId;
	secondPlayerId = secondPlayer.playerId;

	const template = await Template.create({
		name: 'test',
		cap: '1000',
		type: 'FT',
		props: {
			immutable: {},
			mutable: {
				description: 'Test'
			},
			$mutable: {}
		}
	});

	templateId = template.id;

	const tokenIds = await Token.mint({
		playerId,
		tokenObjects: [
			{
				templateId,
				amount: "5"
			}
		]
	});

	tokenId = tokenIds[0];
});

describe('Mint', () => {
	test('By Unique Id', async () => {
		const tokenIds = await Token.mint({
			uniqueId,
			tokenObjects: [
				{
					templateId,
					amount: "1"
				}
			]
		});

		expect(tokenIds.length).toBe(1);
	});

	test('By Player Id', async () => {
		const tokenIds = await Token.mint({
			playerId,
			tokenObjects: [
				{
					templateId,
					amount: "1"
				}
			]
		});

		expect(tokenIds.length).toBe(1);
	});
});

describe('Burn', () => {
	test('By Unique Id', async () => {
		const response = await Token.burn({
			uniqueId,
			tokenObjects: [
				{
					tokenId,
					amount: "1"
				}
			]
		});

		expect(response).toStrictEqual({});
	});

	test('By Player Id', async () => {
		const response = await Token.burn({
			playerId,
			tokenObjects: [
				{
					tokenId,
					amount: "1"
				}
			]
		});

		expect(response).toStrictEqual({});
	});
});

describe('Transfer', () => {
	test('By Unique Id', async () => {
		const response = await Token.transfer({
			fromUniqueId: uniqueId,
			toUniqueId: secondUniqueId,
			tokenObjects: [
				{
					tokenId,
					amount: "1"
				}
			]
		});

		expect(response).toStrictEqual({});
	});

	test('By Player Id', async () => {
		const response = await Token.transfer({
			fromPlayerId: playerId,
			toPlayerId: secondPlayerId,
			tokenObjects: [
				{
					tokenId,
					amount: "1"
				}
			]
		});

		expect(response).toStrictEqual({});
	});
});

test('Mutate', async () => {
	const response = await Token.mutate(tokenId, {description: 'New Description'});

	expect(response).toStrictEqual({});
});

test('Get', async () => {
	const tokens = await Token.get(tokenId);

	expect(tokens.length).toBe(1);
});

test('Get All', async () => {
	const tokens = await Token.getAll({
		start: 0,
		limit: 5,
		templateId
	});

	expect(tokens.length).toBeGreaterThanOrEqual(1);
});

test('Get Mint Requests', async () => {
	const requests = await Token.getMintRequests(tokenId);

	expect(requests.length).toBeGreaterThanOrEqual(1);
});