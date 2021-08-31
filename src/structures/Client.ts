import fetch, { HeaderInit, RequestInit } from 'node-fetch';

import {RequestOptions} from '../util/Interfaces';

export default class Client {
	static setup(key: string) {
		process.env.STARDUST_API_KEY = key;
	}

	static async sendRequest({method, path, body, params}: RequestOptions): Promise<any> {
		const urlParams = params ? '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&') : '';

		const options: RequestInit = {
			method,
			headers: Client.HEADERS
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(Client.BASE_URL + path + urlParams, options).catch(console.error);

		if (!response) {
			return;
		}

		const data = await response.json();
		
		if (response.status !== 500 && response.status !== 200) {
			throw new Error(`Error while sending a request to the Stardust API: ${JSON.stringify(data)}`);
		}

		return response.status === 200 ? data : null;
	}

	static async getGame() {
		return Client.sendRequest({
			method: 'GET',
			path: Client.ENDPOINTS.GET_GAME
		});
	}

	static async getHealth() {
		return Client.sendRequest({
			method: 'GET',
			path: Client.ENDPOINTS.GET_HEALTH
		});
	}

	static async getEndpoints() {
		return Client.sendRequest({
			method: 'GET',
			path: Client.ENDPOINTS.OPEN_API
		});
	}

	static get BASE_URL() {
		return 'https://opzvmjx033.execute-api.us-east-1.amazonaws.com/v1';
	}

	static get HEADERS(): HeaderInit {
		return {
			'Content-Type': 'application/json;charset=UTF-8',
			'x-api-key': process.env.STARDUST_API_KEY
		}
	}

	static get ENDPOINTS() {
		return {
			GET_GAME: '/game/get',
			GET_HEALTH: '/health',
			OPEN_API: '/openapi'
		}
	}
}