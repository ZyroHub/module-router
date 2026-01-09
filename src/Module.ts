import { Core, BaseModule } from '@zyrohub/core';

export interface RouterModuleOptions {};

export class RouterModule extends BaseModule {
	static options: RouterModuleOptions;

	constructor() {
		super();
	}

	async init(core: Core, options: RouterModuleOptions) {

	}
}
