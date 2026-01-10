import { RouteSchema } from '@/components/RouteSchema.js';

import { RouteUtils } from '@/utils/Route.js';

export function Get(route: string = '', schema?: RouteSchema) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		RouteUtils.processMetadata();
	};
}
