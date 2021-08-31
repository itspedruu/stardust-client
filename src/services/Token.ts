import Client from '../structures/Client';
import Player from './Player';

import {Dictionary, TokenOperationOptions, TokenFetchAllOptions, TokenTransferOptions, TokenTradeOptions} from '../util/Interfaces';

export default class Token {
	static get(tokenIds: number[]) {
		return Client.sendRequest({
			method: 'GET',
			path: Token.ENDPOINTS.GET,
			params: {tokenIds: JSON.stringify([tokenIds])}
		})
	}

	static getAll(params: TokenFetchAllOptions) {
		return Client.sendRequest({
			method: 'GET',
			path: Token.ENDPOINTS.GET_ALL,
			params
		});
	}

	static getMintRequests(tokenId: number) {
		return Client.sendRequest({
			method: 'GET',
			path: Token.ENDPOINTS.GET_MINT_REQUESTS,
			params: {tokenId}
		});
	}

	static async mint({uniqueId, playerId, tokenObjects}: TokenOperationOptions) {
		if (!uniqueId && !playerId) {
			throw new Error('playerId or uniqueId is required.');
		}

		const id = uniqueId ? await Player.getPlayerId(uniqueId) : playerId;

		if (!id) {
			return;
		}

		return Client.sendRequest({
			method: 'POST',
			path: Token.ENDPOINTS.MINT,
			body: {
				playerId: id,
				tokenObjects
			}
		})
	}

	static async burn({uniqueId, playerId, tokenObjects}: TokenOperationOptions) {
		if (!uniqueId && !playerId) {
			throw new Error('playerId or uniqueId is required.');
		}

		const id = uniqueId ? await Player.getPlayerId(uniqueId) : playerId;

		if (!id) {
			return;
		}

		return Client.sendRequest({
			method: 'POST',
			path: Token.ENDPOINTS.BURN,
			body: {
				playerId: id,
				tokenObjects
			}
		})
	}

	static mutate(tokenId: number, props: Dictionary) {
		return Client.sendRequest({
			method: 'PUT',
			path: Token.ENDPOINTS.MUTATE,
			body: {
				tokenId,
				props
			}
		});
	}

	static async transfer({fromUniqueId, toUniqueId, fromPlayerId, toPlayerId, tokenObjects}: TokenTransferOptions) {
		if (!fromUniqueId && !fromPlayerId) {
			throw new Error('fromUniqueId or fromPlayerId is required.');
		}

		if (!toUniqueId && !toPlayerId) {
			throw new Error('toUniqueId or toPlayerId is required.');
		}

		const fromId = fromUniqueId ? await Player.getPlayerId(fromUniqueId) : fromPlayerId;

		if (!fromId) {
			return;
		}

		const toId = toUniqueId ? await Player.getPlayerId(toUniqueId) : toPlayerId;

		if (!toId) {
			return;
		}

		return Client.sendRequest({
			method: 'POST',
			path: Token.ENDPOINTS.TRANSFER,
			body: {
				fromPlayerId: fromId,
				toPlayerId: toId,
				tokenObjects
			}
		});
	}

	static async trade({fromUniqueId, toUniqueId, fromPlayerId, toPlayerId, fromTokens, toTokens}: TokenTradeOptions) {
		if (!fromUniqueId && !fromPlayerId) {
			throw new Error('fromUniqueId or fromPlayerId is required.');
		}

		if (!toUniqueId && !toPlayerId) {
			throw new Error('toUniqueId or toPlayerId is required.');
		}

		const fromId = fromUniqueId ? await Player.getPlayerId(fromUniqueId) : fromPlayerId;

		if (!fromId) {
			return;
		}

		const toId = toUniqueId ? await Player.getPlayerId(toUniqueId) : toPlayerId;

		if (!toId) {
			return;
		}

		return Client.sendRequest({
			method: 'POST',
			path: Token.ENDPOINTS.TRADE,
			body: {
				fromPlayerId: fromId,
				toPlayerId: toId,
				fromTokens,
				toTokens
			}
		});
	}
	
	static get ENDPOINTS() {
		return {
			GET: '/token/get',
			GET_ALL: '/token/get-all',
			GET_MINT_REQUESTS: '/token/mint/get-all',
			MINT: '/token/mint',
			BURN: '/token/burn',
			MUTATE: '/token/mutate',
			TRANSFER: '/token/transfer',
			TRADE: '/trade/execute'
		}
	}
}