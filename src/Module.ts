import { Core, BaseModule, Module } from '@zyrohub/core';

export interface RouterModuleOptions {
	path?: string;
	controllers?: any[];
}

@Module()
export class RouterModule extends BaseModule {
	static options: RouterModuleOptions;

	controllers: any[] = [];

	constructor() {
		super();
	}

	async init(data: { core: Core; options: RouterModuleOptions }) {}
}

export default { RouterModule };
