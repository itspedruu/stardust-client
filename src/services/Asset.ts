import Client from '../structures/Client';

export default class Asset {
	static get(path: string) {
		return Client.sendRequest({
			method: 'GET',
			path: Asset.ENDPOINTS.GET,
			params: { path }
		});
	}

	static getAll(subFolder?: string) {
		return Client.sendRequest({
			method: 'GET',
			path: Asset.ENDPOINTS.GET_ALL,
			params: { subFolder }
		});
	}

	static get ENDPOINTS() {
		return {
			GET: '/asset/get',
			GET_ALL: '/asset/get-all'
		}
	}
}