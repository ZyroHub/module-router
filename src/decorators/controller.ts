import {
	ROUTER_CONTROLLER_METADATA_KEY,
	ROUTER_CONTROLLER_ROLE,
	ROUTER_LOAD_ERROR_METADATA_KEY,
	ROUTER_ROLE_METADATA_KEY
} from '@/constants/router.js';
import { Terminal } from '@zyrohub/utilities';

import { MiddlewareUtils } from '@/utils/index.js';

import { MiddlewareVariant, MountedController, MountedMiddleware } from '@/types/index.js';

export interface ControllerOptions {
	path?: string;
	middlewares?: MiddlewareVariant[];
}

export function Controller(options: ControllerOptions | string) {
	return (target: { new (...args: any[]): {} }) => {
		Reflect.defineMetadata(ROUTER_ROLE_METADATA_KEY, ROUTER_CONTROLLER_ROLE, target);

		const path = typeof options === 'string' ? options : options.path || '/';

		const controllerMiddlewares = typeof options === 'string' ? [] : options.middlewares || [];
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

		const mountedController: MountedController = {
			path: path,
			middlewares: mountedControllerMiddlewares,
			constructor: target
		};

		Reflect.defineMetadata(ROUTER_CONTROLLER_METADATA_KEY, mountedController, target);
	};
}
