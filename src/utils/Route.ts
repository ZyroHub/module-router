import { RouteSchema } from '@/components/RouteSchema.js';
import { ROUTER_MIDDLEWARES_METADATA_KEY, ROUTER_ROUTES_METADATA_KEY } from '@/constants/router.js';

import { MountedMiddleware } from '@/types/middleware.js';
import { MountedRoute, RouteMethod } from '@/types/route.js';

export class RouteUtils {
	static processMetadata(
		method: RouteMethod,
		path: string,
		handlerName: string,
		controller: { new (): any },
		schema?: RouteSchema
	) {
		const controllerRoutesMetadata: MountedRoute[] =
			Reflect.getMetadata(ROUTER_ROUTES_METADATA_KEY, controller) || [];

		const controllerMiddlewaresMetadata: MountedMiddleware[] =
			Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, controller) || [];

		const routeMiddlewares = controllerMiddlewaresMetadata
			.filter(middleware => middleware.handlerName === handlerName)
			.reverse()
			.map(middleware => {
				middleware.handlerName = undefined;

				return middleware;
			});

		const mountedRoute: MountedRoute = {
			method,
			path,
			handlerName,
			schema,
			middlewares: routeMiddlewares
		};

		controllerRoutesMetadata.push(mountedRoute);

		const filteredControllerMiddlewaresMetadata = controllerMiddlewaresMetadata.filter(
			middleware => middleware.handlerName !== handlerName
		);
		Reflect.defineMetadata(ROUTER_MIDDLEWARES_METADATA_KEY, filteredControllerMiddlewaresMetadata, controller);

		Reflect.defineMetadata(ROUTER_ROUTES_METADATA_KEY, controllerRoutesMetadata, controller);
	}
}
