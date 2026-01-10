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

export class RouteSchema<
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	validators: {
		body?: SBody;
		query?: SQuery;
		params?: SParams;
	} = {};

	input: {
		body: SBody extends ValidatorSchema ? InferSchemaType<SBody> : undefined;
		query: SQuery extends ValidatorSchema ? InferSchemaType<SQuery> : undefined;
		params: SParams extends ValidatorSchema ? InferSchemaType<SParams> : undefined;
	} = {} as RouteSchema['input'];

	meta: RouteSchemaMeta = {};

	constructor(options: RouteSchemaOptions<SBody, SQuery, SParams> = {}) {
		if (options.body) this.validators.body = options.body;
		if (options.query) this.validators.query = options.query;
		if (options.params) this.validators.params = options.params;

		if (options.meta) this.meta = options.meta;
	}
}
