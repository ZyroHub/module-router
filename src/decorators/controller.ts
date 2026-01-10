import { MiddlewareVariant, MountedMiddleware } from '@/components/Middleware.js';
import {
	ROUTER_CONTROLLER_ROLE,
	ROUTER_MIDDLEWARES_METADATA_KEY,
	ROUTER_ROLE_METADATA_KEY
} from '@/constants/router.js';

export interface ControllerOptions {
	path?: string;
	children?: { new (...args: any[]): any }[];
	middlewares?: MiddlewareVariant[];
}

export function Controller(options: ControllerOptions) {
	return (target: { new (...args: any[]): {} }) => {
		Reflect.defineMetadata(ROUTER_ROLE_METADATA_KEY, ROUTER_CONTROLLER_ROLE, target);

		const middlewareList: MountedMiddleware[] =
			Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, target.constructor) || [];

		const controllerMiddlewares = options.middlewares || [];
	};
}
