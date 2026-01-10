import {
	ROUTER_CONTROLLER_OPTIONS_METADATA_KEY,
	ROUTER_CONTROLLER_ROLE,
	ROUTER_LOAD_ERROR_METADATA_KEY,
	ROUTER_MIDDLEWARES_METADATA_KEY,
	ROUTER_ROLE_METADATA_KEY
} from '@/constants/router.js';
import { Terminal } from '@zyrohub/utilities';

import { MiddlewareUtils } from '@/utils/index.js';

import { MiddlewareVariant, MountedController, MountedMiddleware } from '@/types/index.js';

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
		const mountedControllerMiddlewares: MountedMiddleware[] = [];

		for (const controllerMiddleware of controllerMiddlewares) {
			try {
				const mountedMiddleware = MiddlewareUtils.processMiddlewareVariant(controllerMiddleware);

				mountedMiddleware.isPrimary = true;

				mountedControllerMiddlewares.push(mountedMiddleware);
			} catch (error: any) {
				Reflect.defineMetadata(ROUTER_LOAD_ERROR_METADATA_KEY, true, target.constructor);

				if (error instanceof Error) Terminal.error('ROUTER', error.message);
				else
					Terminal.error(
						'ROUTER',
						`An unknown error occurred while applying middleware. (${target.name} - ${controllerMiddleware})`
					);
			}
		}

		const mergedMiddlewares = [...mountedControllerMiddlewares, ...middlewareList];

		Reflect.defineMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, mergedMiddlewares, target);

		const mountedControllerOptions: MountedController = {
			path: options.path || '/',
			children: options.children || [],
			middlewares: mountedControllerMiddlewares
		};

		Reflect.defineMetadata(ROUTER_CONTROLLER_OPTIONS_METADATA_KEY, mountedControllerOptions, target);
	};
}
