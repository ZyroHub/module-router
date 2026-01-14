import { RouteSchema } from '@/components/RouteSchema.js';

import { MountedMiddleware } from './middleware.js';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface MountedRoute {
	path: string;
	method: RouteMethod;
	handlerName: string;
	schema?: RouteSchema;
	middlewares?: MountedMiddleware[];
}
