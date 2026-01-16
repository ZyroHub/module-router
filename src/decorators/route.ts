import { RouteSchema } from '@/components/RouteSchema.js';

import { RouteUtils } from '@/utils/Route.js';

export function Get(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('GET', path, propertyKey, target.constructor, schema);
	};
}

export function Post(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('POST', path, propertyKey, target.constructor, schema);
	};
}

export function Put(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('PUT', path, propertyKey, target.constructor, schema);
	};
}

export function Delete(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('DELETE', path, propertyKey, target.constructor, schema);
	};
}

export function Patch(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('PATCH', path, propertyKey, target.constructor, schema);
	};
}

export function Options(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('OPTIONS', path, propertyKey, target.constructor, schema);
	};
}

export function Head(path: string = '', schema?: RouteSchema<any, any, any>) {
	return function (target: any, propertyKey: string) {
		RouteUtils.processMetadata('HEAD', path, propertyKey, target.constructor, schema);
	};
}
