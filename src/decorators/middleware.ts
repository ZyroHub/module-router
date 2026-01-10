import { MiddlewareVariant, MountedMiddleware, RouterMiddlewareClass } from '@/components/Middleware.js';
import {
	ROUTER_LOAD_ERROR_METADATA_KEY,
	ROUTER_MIDDLEWARE_ROLE,
	ROUTER_MIDDLEWARES_METADATA_KEY,
	ROUTER_ROLE_METADATA_KEY
} from '@/constants/index.js';
import { Ansi, Terminal } from '@zyrohub/utilities';

import { MiddlewareUtils } from '@/utils/index.js';

export function Middleware() {
	return (target: { new (...args: any[]): {} }) => {
		Reflect.defineMetadata(ROUTER_ROLE_METADATA_KEY, ROUTER_MIDDLEWARE_ROLE, target);
	};
}

export function UseMiddleware(...middlewares: MiddlewareVariant[]) {
	return function (target: any, propertyKey: string) {
		const middlewareList: MountedMiddleware[] =
			Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, target.constructor) || [];

		for (const middleware of middlewares) {
			try {
				const mountedMiddleware = MiddlewareUtils.processMiddlewareVariant(middleware);

				mountedMiddleware.handlerName = propertyKey;

				middlewareList.push(mountedMiddleware);
			} catch (error: any) {
				Reflect.defineMetadata(ROUTER_LOAD_ERROR_METADATA_KEY, true, target.constructor);

				if (error instanceof Error) Terminal.error('ROUTER', error.message);
				else
					Terminal.error(
						'ROUTER',
						`An unknown error occurred while applying middleware. (${target.constructor.name} - ${middleware})`
					);
			}
		}

		Reflect.defineMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, middlewareList, target.constructor);
	};
}
