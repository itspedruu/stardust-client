import Client from '../structures/Client';

import { PlayerFetchForceOptions, PlayerFetchOptions, PlayerMutationOptions } from 'util/Interfaces';

const PLAYER_IDS = {};

export default class Player {
	static async create(uniqueId, userData?) {
		const user = await Client.sendRequest({
			method: 'POST',
			path: Player.ENDPOINTS.CREATE,
			body: {
				uniqueId,
				userData: userData ?? {}
			}
		});

		PLAYER_IDS[uniqueId] = user.playerId;

		return user;
	}

	static async getPlayerId(uniqueId) {
		if (uniqueId in PLAYER_IDS) {
			return PLAYER_IDS[uniqueId];
		}

		const data = await Client.sendRequest({
			method: 'GET',
			path: Player.ENDPOINTS.GET_ID,
			params: { uniqueId }
		});

		if (!data) {
			return;
		}

		PLAYER_IDS[uniqueId] = data.playerId;

		return data.playerId;
	}

	static async getPlayerIds() {
		const data = await Client.sendRequest({
			method: 'GET',
			path: Player.ENDPOINTS.GET_IDS
		});

		if (!data) {
			return;
		}

		for (const id of Object.keys(data)) {
			PLAYER_IDS[id] = data[id];
		}

		return data;
	}

	static async getInventory({uniqueId, playerId}) {
		if (!uniqueId && !playerId) {
			throw new Error('playerId or uniqueId is required.');
		}

		const id = uniqueId ? await Player.getPlayerId(uniqueId) : playerId;

		if (!id) {
			return;
		}

		return Client.sendRequest({
			method: 'GET',
			path: Player.ENDPOINTS.GET_INVENTORY,
			params: {playerId: id}
		});;
	}

	static async get({uniqueId, playerId, force}: PlayerFetchOptions) {
		if (!uniqueId && !playerId) {
			throw new Error('playerId or uniqueId is required.');
		}

		return uniqueId ? Player.getByUniqueId(uniqueId, force) : Player.getByPlayerId(playerId, force);
	}

	static async getByUniqueId(id, force?: PlayerFetchForceOptions) {
		const playerId = await Player.getPlayerId(id);

		if (!playerId && !force?.enabled) {
			return;
		}

		return playerId ? Player.getByPlayerId(playerId, force) : Player.create(id, force?.userData);
	}

	static async getByPlayerId(id, force?: PlayerFetchForceOptions) {
		const user = await Client.sendRequest({
			method: 'GET',
			path: Player.ENDPOINTS.GET,
			params: { playerId: id }
		});

		if (!force?.enabled || user) {
			return user;
		}

		return Player.create(id, force?.userData);
	}

	static async mutate({uniqueId, playerId, props}: PlayerMutationOptions) {
		if (!uniqueId && !playerId) {
			throw new Error('playerId or uniqueId is required.');
		}

		const id = uniqueId ? await Player.getPlayerId(uniqueId) : playerId;

		if (!id) {
			return;
		}

		return Client.sendRequest({
			method: 'POST',
			path: Player.ENDPOINTS.MUTATE,
			body: {
				playerId: id,
				props
			}
		});
	}

	static get ENDPOINTS() {
		return {
			GET: '/player/get',
			GET_ID: '/player/get-id',
			GET_IDS: '/player/get-ids',
			GET_INVENTORY: '/player/get-inventory',
			CREATE: '/player/create',
			MUTATE: '/player/mutate'
		}
	}
}