export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface MountedRoute {
    path: string;
    method: RouteMethod;
}
