import { RouterMiddleware } from '@/components/Middleware.js';

export type RouterMiddlewareClass<T extends RouterMiddleware = RouterMiddleware> = {
	new (...args: any[]): T;
	configure: (options: any) => MountedMiddleware<any>;
};

export type MountedMiddleware<T = any> = {
	constructor: RouterMiddlewareClass<any>;
	options: T;
	handlerName?: string;
	isPrimary?: boolean;
};

export type MiddlewareVariant = RouterMiddlewareClass | MountedMiddleware;
