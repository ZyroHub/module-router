import { InferSchemaType, ValidatorSchema } from '@zyrohub/utilities';

export interface RouteSchemaMeta {
	tags?: string[];
	summary?: string;
	description?: string;
}

export interface RouteSchemaOptions<
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	body?: SBody;
	query?: SQuery;
	params?: SParams;

	meta?: RouteSchemaMeta;
}

export interface RouterGlobalInputs {}

export type RouterGlobalRequest = RouterGlobalInputs extends { request: infer R } ? R : any;
export type RouterGlobalResponse = RouterGlobalInputs extends { response: infer R } ? R : any;
export type RouterGlobalData = RouterGlobalInputs extends { data: infer D } ? D : any;

export interface RouterSchemaInputs {
	request: RouterGlobalRequest;
	response: RouterGlobalResponse;

	data: RouterGlobalData;
}

export type RouterSchemaRequest = RouterSchemaInputs['request'];
export type RouterSchemaResponse = RouterSchemaInputs['response'];
export type RouterSchemaData = RouterSchemaInputs['data'];

export interface RouteSchemaContext<
	SRequest = RouterSchemaRequest,
	SResponse = RouterSchemaResponse,
	SData = RouterSchemaData,
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	request: SRequest;
	response: SResponse;
	data: SData;

	body: SBody extends ValidatorSchema ? InferSchemaType<SBody> : undefined;
	query: SQuery extends ValidatorSchema ? InferSchemaType<SQuery> : undefined;
	params: SParams extends ValidatorSchema ? InferSchemaType<SParams> : undefined;
}

export class RouteSchema<
	SRequest = RouterSchemaRequest,
	SResponse = RouterSchemaResponse,
	SData = RouterSchemaData,
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	validators: {
		body?: SBody;
		query?: SQuery;
		params?: SParams;
	} = {};

	meta: RouteSchemaMeta = {};

	context: RouteSchemaContext<SRequest, SResponse, SData, SBody, SQuery, SParams> = {} as RouteSchemaContext<
		SRequest,
		SResponse,
		SData,
		SBody,
		SQuery,
		SParams
	>;

	constructor(options: RouteSchemaOptions<SBody, SQuery, SParams> = {}) {
		if (options.body) this.validators.body = options.body;
		if (options.query) this.validators.query = options.query;
		if (options.params) this.validators.params = options.params;

		if (options.meta) this.meta = options.meta;
	}

	static createBase<
		SRequest = RouterSchemaRequest,
		SResponse = RouterSchemaResponse,
		SData = RouterSchemaData,
		SBody extends ValidatorSchema = ValidatorSchema,
		SQuery extends ValidatorSchema = ValidatorSchema,
		SParams extends ValidatorSchema = ValidatorSchema
	>(options: RouteSchemaOptions<SBody, SQuery, SParams> = {}) {
		return class Base<
			IBody extends ValidatorSchema = ValidatorSchema,
			IQuery extends ValidatorSchema = ValidatorSchema,
			IParams extends ValidatorSchema = ValidatorSchema
		> extends RouteSchema<SRequest, SResponse, SData, SBody & IBody, SQuery & IQuery, SParams & IParams> {
			constructor(input: RouteSchemaOptions<IBody, IQuery, IParams> = {}) {
				super({
					...((input.body || options.body) && {
						body: {
							...options.body,
							...input.body
						} as SBody & IBody
					}),

					...((input.query || options.query) && {
						query: {
							...options.query,
							...input.query
						} as SQuery & IQuery
					}),

					...((input.params || options.params) && {
						params: {
							...options.params,
							...input.params
						} as SParams & IParams
					}),

					...((input.meta || options.meta) && {
						meta: {
							...options.meta,
							...input.meta
						}
					})
				});
			}
		};
	}
}

export default { RouteSchema };
