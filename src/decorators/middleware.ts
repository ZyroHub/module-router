import { MountedMiddleware, RouterMiddlewareClass } from '@/components/Middleware.js';
import {
	ROUTER_LOAD_ERROR_METADATA_KEY,
	ROUTER_MIDDLEWARE_ROLE,
	ROUTER_MIDDLEWARES_METADATA_KEY,
	ROUTER_ROLE_METADATA_KEY
} from '@/constants/index.js';
import { Ansi, Terminal } from '@zyrohub/utilities';

export function Middleware() {
	return (target: { new (...args: any[]): {} }) => {
		Reflect.defineMetadata(ROUTER_ROLE_METADATA_KEY, ROUTER_MIDDLEWARE_ROLE, target);
	};
}

export function UseMiddleware(...middlewares: (RouterMiddlewareClass | MountedMiddleware)[]) {
	return function (target: any) {
		const middlewareList: MountedMiddleware[] =
			Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, target.constructor) || [];

		for (const middleware of middlewares) {
			let MiddlewareConstructor: RouterMiddlewareClass;

			if (typeof middleware === 'function') {
				MiddlewareConstructor = middleware;
			} else {
				MiddlewareConstructor = middleware.constructor;
			}

			const isMiddleware = Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, MiddlewareConstructor);

			if (!isMiddleware) {
				Terminal.error(
					'CORE',
					`The class ${Ansi.yellow(
						MiddlewareConstructor.name
					)} is not a valid middleware. Did you forget the ${Ansi.cyan('@Middleware()')} decorator?`
				);

				Reflect.defineMetadata(ROUTER_LOAD_ERROR_METADATA_KEY, true, target);
				return;
			}

			if (typeof middleware === 'function') {
				middlewareList.push((middleware as RouterMiddlewareClass).configure({}));
			} else {
				middlewareList.push(middleware as MountedMiddleware);
			}
		}

		Reflect.defineMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, middlewareList, target.constructor);
	};
}
