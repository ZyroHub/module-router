import { RouterMiddleware } from '@/components/Middleware.js';
import { RouterGlobalData, RouterGlobalRequest, RouterGlobalResponse } from '@/components/RouteSchema.js';

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

export interface RouterMiddlewareContext<
	SRequest = RouterGlobalRequest,
	SResponse = RouterGlobalResponse,
	SData = RouterGlobalData
> {
	request: SRequest;
	response: SResponse;
	data: SData;

	body: any;
	query: any;
	params: any;
}
