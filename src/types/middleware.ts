import { RouterMiddleware } from '@/components/Middleware.js';
import { RouterGlobalState, RouterGlobalRequest, RouterGlobalResponse } from '@/components/RouteSchema.js';

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
	SState = RouterGlobalState
> {
	request: SRequest;
	response: SResponse;
	state: SState;

	body: any;
	query: any;
	params: any;
}
