import { MiddlewareVariant, MountedMiddleware, RouterMiddlewareClass } from '@/components/Middleware.js';
import { ROUTER_MIDDLEWARES_METADATA_KEY } from '@/constants/router.js';

export class MiddlewareUtils {
	static processMiddlewareVariant(variant: MiddlewareVariant): MountedMiddleware {
		let MiddlewareConstructor: RouterMiddlewareClass;

		if (typeof variant === 'function') {
			MiddlewareConstructor = variant;
		} else {
			MiddlewareConstructor = variant.constructor;
		}

		const isMiddleware = Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, MiddlewareConstructor);

		if (!isMiddleware)
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
