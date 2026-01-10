import { RouteSchema } from '@/components/RouteSchema.js';
import { ROUTER_ROUTES_METADATA_KEY } from '@/constants/router.js';

import { MountedRoute, RouteMethod } from '@/types/route.js';

export class RouteUtils {
	static processMetadata(
		method: RouteMethod,
		path: string,
		handlerName: string,
		constructor: { new (): any },
		schema?: RouteSchema
	) {
		const routesMetadata: MountedRoute[] = Reflect.getMetadata(ROUTER_ROUTES_METADATA_KEY, constructor) || [];
	}
}
