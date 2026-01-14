import { MountedMiddleware } from './middleware.js';
import { MountedRoute } from './route.js';

export interface MountedController {
	path: string;
	middlewares: MountedMiddleware[];
	constructor: { new (...args: any[]): {} };
}

export interface DefinedController {
	data: MountedController;
	routes: MountedRoute[];
}
