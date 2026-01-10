import { ROUTER_CONTROLLER_ROLE, ROUTER_ROLE_METADATA_KEY } from '@/constants/router.js';

export function Controller() {
	return (target: { new (...args: any[]): {} }) => {
		Reflect.defineMetadata(ROUTER_ROLE_METADATA_KEY, ROUTER_CONTROLLER_ROLE, target);
	};
}
