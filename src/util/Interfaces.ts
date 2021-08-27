export interface Dictionary {
	[name: string]: any;
}

export interface RequestOptions {
	method: string;
	path: string;
	params?: Dictionary;
	body?: Dictionary;
}

export interface TemplateOptions {
	name: string;
	cap: string;
	type: TemplateType;
	props: TemplateProps
}

export type TemplateType = 'FT' | 'NFT';

export interface TemplateProps {
	immutable: Dictionary;
	mutable: Dictionary;
	$mutable: Dictionary
}

export interface TemplateFetchAllOptions {
	start: number;
	limit: number;
	filter?: string;
}

export interface PlayerFetchOptions {
	uniqueId?: string;
	playerId?: string;
	force?: PlayerFetchForceOptions;
}

export interface PlayerFetchForceOptions {
	enabled: boolean;
	userData?: Dictionary;
}

export interface PlayerMutationOptions {
	uniqueId?: string;
	playerId?: string;
	props: Dictionary;
}

export interface TokenProps {
	immutable: Dictionary;
	mutable: Dictionary;
}

export interface TokenObject {
	templateId?: number;
	tokenId?: number;
	amount: string;
	props?: TokenProps;
}

export interface TokenOperationOptions {
	uniqueId?: string;
	playerId?: string;
	tokenObjects: TokenObject[];
}

export interface TokenFetchAllOptions {
	start: number;
	limit: number;
	templateId: number;
}

export interface TokenTransferOptions {
	fromPlayerId?: string;
	toPlayerId?: string;
	fromUniqueId?: string;
	toUniqueId?: string;
	tokenObjects: TokenObject[];
}