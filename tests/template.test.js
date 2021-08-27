const {Client, Template} = require('../lib');

require('dotenv').config();

// redundant use because they use the same key name for the environment variable. 
// this is used to show devs how to use the setup
Client.setup(process.env.STARDUST_API_KEY);

let templateId;

const TEST_DATA = {
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
};

test('Create And Get Template', async () => {
	const template = await Template.create(TEST_DATA);

	templateId = template.id;

	expect(await Template.get(template.id)).toHaveProperty('name');
});

test('Get All', async () => {
	const templates = await Template.getAll({
		start: 0,
		limit: 5
	});

	expect(templates.length).toBeGreaterThanOrEqual(1);
});

test('Mutate', async () => {
	await Template.mutate(templateId, {
		description: 'New Description'
	});

	const template = await Template.get(templateId);

	expect(template.props.mutable.description).toBe('New Description');
});

test('Remove', async () => {
	const createdTemplate = await Template.create(TEST_DATA);

	await Template.remove(createdTemplate.id);

	expect(await Template.get(createdTemplate.id)).toBeFalsy(); 
});