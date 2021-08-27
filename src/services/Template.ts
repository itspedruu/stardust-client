import Client from '../structures/Client';

import {TemplateOptions, TemplateFetchAllOptions} from '../util/Interfaces';

export default class Template {
	static create(options: TemplateOptions) {
		return Client.sendRequest({
			method: 'POST',
			path: Template.ENDPOINTS.CREATE,
			body: options
		});
	}
	
	static get(id) {
		return Client.sendRequest({
			method: 'GET',
			path: Template.ENDPOINTS.GET,
			params: { templateIds: JSON.stringify([id]) }
		});
	}

	static getAll(options: TemplateFetchAllOptions) {
		return Client.sendRequest({
			method: 'GET',
			path: Template.ENDPOINTS.GET_ALL,
			params: options
		});
	}

	static remove(id) {
		return Client.sendRequest({
			method: 'DELETE',
			path: Template.ENDPOINTS.DELETE,
			params: { templateId: id }
		});
	}

	static mutate(id, props) {
		return Client.sendRequest({
			method: 'PUT',
			path: Template.ENDPOINTS.MUTATE,
			body: {
				templateId: id,
				props
			}
		});
	}

	static get ENDPOINTS() {
		return {
			CREATE: '/template/create',
			GET: '/template/get',
			GET_ALL: '/template/get-all',
			DELETE: '/template/remove',
			MUTATE: '/template/mutate'
		}
	}
}