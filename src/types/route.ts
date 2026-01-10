import { RouteSchema } from '@/components/RouteSchema.js';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface MountedRoute {
	path: string;
	method: RouteMethod;
	handlerName: string;
	schema?: RouteSchema;
}
