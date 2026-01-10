import { MountedMiddleware } from './middleware.js';

export interface MountedController {
	path: string;
	children: { new (...args: any[]): any }[];
	middlewares: MountedMiddleware[];
}
