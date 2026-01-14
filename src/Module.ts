import { Core, BaseModule, Module } from '@zyrohub/core';
import { Ansi, FileSystem, Terminal } from '@zyrohub/utilities';

import {
	ROUTER_CONTROLLER_METADATA_KEY,
	ROUTER_CONTROLLER_ROLE,
	ROUTER_ROLE_METADATA_KEY,
	ROUTER_ROUTES_METADATA_KEY
} from './constants/router.js';
import { DefinedController, MountedController } from './types/controller.js';
import { MountedRoute } from './types/route.js';

export interface RouterModuleLoaderOptions {
	path: string;
	pattern?: RegExp;
}

export interface RouterModuleOptions {
	loader?: RouterModuleLoaderOptions;

	controllers?: { new (): any }[];
}

@Module()
export class RouterModule extends BaseModule {
	static options: RouterModuleOptions;

	controllers: DefinedController[] = [];

	constructor() {
		super();
	}

	private async handleLoadController(controller: { new (): any }, parent?: MountedController) {
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

		const controllerMetadata: MountedController = Reflect.getMetadata(ROUTER_CONTROLLER_METADATA_KEY, controller);
		const controllerRoutes: MountedRoute[] = Reflect.getMetadata(ROUTER_ROUTES_METADATA_KEY, controller) || [];

		const definedController: DefinedController = {
			data: controllerMetadata,
			routes: controllerRoutes
		};

		this.controllers.push(definedController);
	}

	private async handleLoadControllers(controllers: { new (): any }[]) {
		let loadedControllersCount = 0;

		for (const controller of controllers || []) {
			await this.handleLoadController(controller);
			loadedControllersCount++;
		}

		if (loadedControllersCount)
			Terminal.info('ROUTER', `Successfully loaded ${Ansi.green(loadedControllersCount)} controllers.`);
	}

	private async handleLoadControllersFromLoader(loader_data: RouterModuleLoaderOptions) {
		let loadedControllersCount = 0;

		await FileSystem.loadFolder(
			loader_data.path,
			{
				recursive: true,
				filter_files: [loader_data.pattern || /\.ts$|\.js$/],
				auto_import: true,
				auto_default: false
			},
			undefined,
			async file => {
				if (!file.content) return;

				for (const exportedItemKey of Object.keys(file.content)) {
					const exportedItem = (file.content as any)[exportedItemKey];

					const isClass =
						typeof exportedItem === 'function' &&
						/^class\s/.test(Function.prototype.toString.call(exportedItem));

					if (!isClass) continue;

					const controllerRole: string = Reflect.getMetadata(ROUTER_ROLE_METADATA_KEY, exportedItem);
					if (controllerRole !== ROUTER_CONTROLLER_ROLE) continue;

					await this.handleLoadController(exportedItem);

					loadedControllersCount++;
				}
			}
		);

		if (loadedControllersCount)
			Terminal.info(
				'ROUTER',
				`Successfully loaded ${Ansi.green(loadedControllersCount)} controllers from loader.`
			);
	}

	async init(data: { core: Core; options: RouterModuleOptions }) {
		await Promise.all([
			this.handleLoadControllers(data.options.controllers || []),
			...(data.options.loader ? [this.handleLoadControllersFromLoader(data.options.loader)] : [])
		]);

		const existingControllers = data.core.storage.get('router.controllers') || [];
		data.core.storage.set('router.controllers', [...existingControllers, ...this.controllers]);
	}
}

export default { RouterModule };
