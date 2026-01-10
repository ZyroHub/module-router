import { Core, BaseModule, Module } from '@zyrohub/core';
import { Ansi, Terminal } from '@zyrohub/utilities';

import { RouterMiddleware } from './components/Middleware.js';
import {
	ROUTER_CONTROLLER_OPTIONS_METADATA_KEY,
	ROUTER_CONTROLLER_ROLE,
	ROUTER_ROLE_METADATA_KEY,
	ROUTER_ROUTES_METADATA_KEY
} from './constants/router.js';
import { MountedController } from './types/controller.js';

export interface RouterModuleOptions {
	loader?: {
		path: string;
		pattern?: RegExp;
	};

	controllers?: { new (): any }[];
}

@Module()
export class RouterModule extends BaseModule {
	static options: RouterModuleOptions;

	controllers: { new (): any }[] = [];
	middlewares: (typeof RouterMiddleware)[] = [];

	constructor() {
		super();
	}

	private async handleLoadController(controller: { new (): any }) {
		const controllerRole: string = Reflect.getMetadata(ROUTER_ROLE_METADATA_KEY, controller);

		if (controllerRole !== ROUTER_CONTROLLER_ROLE) {
			Terminal.error(
				'CORE',
				`The class ${Ansi.yellow(
					controller.name
				)} is not a valid controller. Did you forget the ${Ansi.cyan('@Controller()')} decorator?`
			);
			return;
		}

		const controllerOptions: MountedController = Reflect.getMetadata(
			ROUTER_CONTROLLER_OPTIONS_METADATA_KEY,
			controller
		);

		console.log({
			role: Reflect.getMetadata(ROUTER_ROLE_METADATA_KEY, controller),
			data: Reflect.getMetadataKeys(controller),
			options: Reflect.getMetadata(ROUTER_CONTROLLER_OPTIONS_METADATA_KEY, controller),
			routes: Reflect.getMetadata(ROUTER_ROUTES_METADATA_KEY, controller)
		});

		if (controllerOptions.children.length > 0) {
			await this.handleLoadControllers(controllerOptions.children);
		}
	}

	private async handleLoadControllers(controllers: { new (): any }[]) {
		for (const controller of controllers || []) {
			await this.handleLoadController(controller);
		}
	}

	async init(data: { core: Core; options: RouterModuleOptions }) {
		await this.handleLoadControllers(data.options.controllers || []);
	}
}

export default { RouterModule };
