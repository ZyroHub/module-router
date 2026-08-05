import { InferSchemaType, ValidatorSchema } from '../index.js';
import { Readable } from 'node:stream';

export interface RouteSchemaMeta {
	tags?: string[];
	summary?: string;
	description?: string;
}

export type RouteSchemaContentType =
	| 'application/json'
	| 'multipart/form-data'
	| 'application/x-www-form-urlencoded'
	| 'application/octet-stream'
	| 'text/plain';

export interface RouteSchemaFilesField {
	name: string;
	maxSize?: number;
	minCount?: number;
	maxCount?: number;
	mimeTypes?: string[];
}

export interface RouteSchemaFilesOptions {
	maxFiles?: number;
	maxFileSize?: number;
	mimeTypes?: string[];
	any?: boolean;
}

export interface RouteSchemaFiles {
	fields?: RouteSchemaFilesField[];
	options?: RouteSchemaFilesOptions;
}

export interface RouteSchemaOptions<
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	body?: SBody;
	query?: SQuery;
	params?: SParams;

	files?: RouteSchemaFiles;

	consumes?: RouteSchemaContentType[];

	meta?: RouteSchemaMeta;
}

export interface RouterGlobalInputs {}

export type RouterGlobalRequest = RouterGlobalInputs extends { request: infer R } ? R : any;
export type RouterGlobalResponse = RouterGlobalInputs extends { response: infer R } ? R : any;
export type RouterGlobalState = RouterGlobalInputs extends { state: infer D } ? D : any;

export interface RouterSchemaInputs {
	request: RouterGlobalRequest;
	response: RouterGlobalResponse;

	state: RouterGlobalState;
}

export type RouterSchemaRequest = RouterSchemaInputs['request'];
export type RouterSchemaResponse = RouterSchemaInputs['response'];
export type RouterSchemaState = RouterSchemaInputs['state'];

export interface RouteSchemaContextFile {
	fieldName: string;
	fileName: string;
	mimeType: string;
	encoding: string;

	stream: Readable;
	toBuffer(): Promise<Buffer>;
	saveTo(destinationPath: string): Promise<void>;
}

export interface RouteSchemaContext<
	SRequest = RouterSchemaRequest,
	SResponse = RouterSchemaResponse,
	SState = RouterSchemaState,
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	request: SRequest;
	response: SResponse;
	state: SState;

	body: SBody extends ValidatorSchema ? InferSchemaType<SBody> : undefined;
	query: SQuery extends ValidatorSchema ? InferSchemaType<SQuery> : undefined;
	params: SParams extends ValidatorSchema ? InferSchemaType<SParams> : undefined;

	processMultipart: (file_callback: (file: RouteSchemaContextFile) => any) => Promise<{
		body: SBody extends ValidatorSchema ? InferSchemaType<SBody> : undefined;
		files: RouteSchemaContextFile[];
	}>;
}

export class RouteSchema<
	SRequest = RouterSchemaRequest,
	SResponse = RouterSchemaResponse,
	SState = RouterSchemaState,
	SBody extends ValidatorSchema = ValidatorSchema,
	SQuery extends ValidatorSchema = ValidatorSchema,
	SParams extends ValidatorSchema = ValidatorSchema
> {
	validators: {
		body?: SBody;
		query?: SQuery;
		params?: SParams;

		files?: RouteSchemaFiles;
	} = {};

	meta: RouteSchemaMeta = {};

	consumes: RouteSchemaContentType[] = [];

	context: RouteSchemaContext<SRequest, SResponse, SState, SBody, SQuery, SParams> = {} as RouteSchemaContext<
		SRequest,
		SResponse,
		SState,
		SBody,
		SQuery,
		SParams
	>;

	constructor(options: RouteSchemaOptions<SBody, SQuery, SParams> = {}) {
		if (options.body) this.validators.body = options.body;
		if (options.query) this.validators.query = options.query;
		if (options.params) this.validators.params = options.params;

		if (options.meta) this.meta = options.meta;

		if (options.files) {
			this.validators.files = options.files;
		}

		if (options.consumes) {
			this.consumes = options.consumes;
		} else if (options.files) {
			this.consumes = ['multipart/form-data'];
		} else if (options.body) {
			this.consumes = ['application/json'];
		}
	}

	static createBase<
		SRequest = RouterSchemaRequest,
		SResponse = RouterSchemaResponse,
		SState = RouterSchemaState,
		SBody extends ValidatorSchema = ValidatorSchema,
		SQuery extends ValidatorSchema = ValidatorSchema,
		SParams extends ValidatorSchema = ValidatorSchema
	>(options: RouteSchemaOptions<SBody, SQuery, SParams> = {}) {
		return class Base<
			IBody extends ValidatorSchema = ValidatorSchema,
			IQuery extends ValidatorSchema = ValidatorSchema,
			IParams extends ValidatorSchema = ValidatorSchema
		> extends RouteSchema<
			SRequest,
			SResponse,
			SState,
			[ValidatorSchema] extends [IBody] ? SBody : IBody,
			[ValidatorSchema] extends [IQuery] ? SQuery : IQuery,
			[ValidatorSchema] extends [IParams] ? SParams : IParams
		> {
			constructor(input: RouteSchemaOptions<IBody, IQuery, IParams> = {}) {
				super({
					...(input.body !== undefined
						? { body: input.body }
						: options.body !== undefined
						? { body: options.body }
						: {}),

					...(input.query !== undefined
						? { query: input.query }
						: options.query !== undefined
						? { query: options.query }
						: {}),

					...(input.params !== undefined
						? { params: input.params }
						: options.params !== undefined
						? { params: options.params }
						: {}),

					...((input.meta || options.meta) && {
						meta: {
							...options.meta,
							...input.meta
						}
					}),

					...((input.consumes || options.consumes) && {
						consumes: Array.from(new Set([...(options.consumes || []), ...(input.consumes || [])]))
					}),

					...((input.files || options.files) && {
						files: {
							options: {
								...options.files?.options,
								...input.files?.options
							},
							fields: [...(options.files?.fields || []), ...(input.files?.fields || [])]
						}
					})
				} as any);
			}
		};
	}
}

export default { RouteSchema };
