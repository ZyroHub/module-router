import { ROUTER_MIDDLEWARE_ROLE, ROUTER_ROLE_METADATA_KEY } from '@/constants/router.js';

import { MiddlewareVariant, MountedMiddleware, RouterMiddlewareClass } from '@/types/index.js';

export class MiddlewareUtils {
	static processMiddlewareVariant(variant: MiddlewareVariant): MountedMiddleware {
		let MiddlewareConstructor: RouterMiddlewareClass;

		if (typeof variant === 'function') {
			MiddlewareConstructor = variant;
		} else {
			MiddlewareConstructor = variant.constructor;
		}

		const middlewareRole: string = Reflect.getMetadata(ROUTER_ROLE_METADATA_KEY, MiddlewareConstructor);

		if (middlewareRole !== ROUTER_MIDDLEWARE_ROLE)
			throw new Error(
				`The class ${MiddlewareConstructor.name} is not a valid middleware. Did you forget the @Middleware() decorator?`
			);

		let mountedMiddleware: MountedMiddleware | null = null;

		if (typeof variant === 'function') {
			mountedMiddleware = (variant as RouterMiddlewareClass).configure({});
		} else {
			mountedMiddleware = variant as MountedMiddleware;
		}

		return mountedMiddleware;
	}
}
