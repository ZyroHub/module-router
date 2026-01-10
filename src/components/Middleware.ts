export type RouterMiddlewareClass<T extends RouterMiddleware = RouterMiddleware> = {
	new (...args: any[]): T;
	configure: (options: any) => MountedMiddleware<any>;
};

export type MountedMiddleware<T = any> = {
	constructor: RouterMiddlewareClass<any>;
	options: T;
	handlerName?: string;
	isPrimary?: boolean;
};

export type MiddlewareVariant = RouterMiddlewareClass | MountedMiddleware;

export class RouterMiddleware {
	static options: any;

	static configure<TConfigure extends (typeof RouterMiddleware)['options']>(
		this: RouterMiddlewareClass,
		options: TConfigure
	): MountedMiddleware<TConfigure> {
		return {
			constructor: this,
			options
		};
	}

	async execute(context: any, options: any) {}
}
