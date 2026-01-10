import { Core, BaseModule, Module } from '@zyrohub/core';

import { RouterMiddleware } from './components/Middleware.js';

export interface RouterModuleOptions {
	loader?: {
		path: string;
		pattern?: RegExp;
	};

	controllers?: any[];
}

@Module()
export class RouterModule extends BaseModule {
	static options: RouterModuleOptions;

	controllers: any[] = [];
	middlewares: (typeof RouterMiddleware)[] = [];

	constructor() {
		super();
	}

	async init(data: { core: Core; options: RouterModuleOptions }) {
		// this.core?.storage?.set('routes', []);
	}
}

export default { RouterModule };
