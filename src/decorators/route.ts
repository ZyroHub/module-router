import { RouteSchema } from '@/components/RouteSchema.js';

import { RouteUtils } from '@/utils/Route.js';

export function Get(path: string = '', schema?: RouteSchema) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('GET', path, propertyKey, target.constructor, schema);
	};
}
