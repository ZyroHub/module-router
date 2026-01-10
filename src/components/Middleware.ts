import { MountedMiddleware, RouterMiddlewareClass } from '@/types/index.js';

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
