<div align="center">
    <img src="https://i.imgur.com/KVVR2dM.png">
</div>

## ZyroHub - Router Module

<p>This module provides routing capabilities, allowing for easy management of application routes and middleware.</p>

## Table of Contents

- [ZyroHub - Router Module](#zyrohub---router-module)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
    - [Using Module and Registering Controllers](#using-module-and-registering-controllers)
    - [TypeScript Configuration](#typescript-configuration)
- [Creating a Controller](#creating-a-controller)
- [Route Schema](#route-schema)
- [Automatic Validation](#automatic-validation)
    - [Using Zod](#using-zod)
    - [Using Yup](#using-yup)
    - [Using Class-Validator](#using-class-validator)
- [HttpResponse](#httpresponse)
- [Creating Middleware](#creating-middleware)
    - [Using Middleware in Controllers or Routes](#using-middleware-in-controllers-or-routes)
- [Getting generated routes](#getting-generated-routes)
- [Declaring Request and Response types](#declaring-request-and-response-types)

## Getting Started

To install the router module, use one of the following package managers:

[NPM Repository](https://www.npmjs.com/package/@zyrohub/module-router)

```bash
# npm
npm install @zyrohub/module-router
# yarn
yarn add @zyrohub/module-router
# pnpm
pnpm add @zyrohub/module-router
# bun
bun add @zyrohub/module-router
```

### Using Module and Registering Controllers

To use the router module, you need to install [`@zyrohub/core`](https://www.npmjs.com/package/@zyrohub/core) and register the `RouterModule`:

```typescript
const core = new Core({
	modules: [
		RouterModule.mount({
			// using manual controller registration
			controllers: [HomeController, AuthController, StoreController],

			// or using automatic controller registration by specifying the path
			loader: {
				path: `${__dirname}/controllers`,
				// optional glob pattern to match controller files
				pattern: /\.controller\.ts$/
			}
		})
	],
	providers: [
		// register any services or repositories here for dependency injection
		// see @zyrohub/core documentation for more details
	]
});

core.init();
```

### TypeScript Configuration

⚠️ **Important:** To use the Dependency Injection system, you **must** enable `emitDecoratorMetadata` in your `tsconfig.json`.

```json
{
	"compilerOptions": {
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true
	}
}
```

## Creating a Controller

You can create a controller by using the `@Controller` decorator and defining routes with decorators like `@Get`, `@Post`, `@Put`, etc.

```typescript
import { Controller, Get, HttpResponse } from '@zyrohub/module-router';

import { ProductsRepository } from './repositories/ProductsRepository.js';
import { StoreProductsSchema } from './schemas/StoreProductsSchema.js';

@Controller({
	path: '/'
})
class StoreController {
	// Dependency injection can be used in the constructor
	constructor(
		// inject services or other dependencies here
		private readonly productsRepository: ProductsRepository
	) {}

	@Get('/products')
	getProducts(context: StoreProductsSchema) {
		return HttpResponse.success({ products: this.productsRepository.findAll() });
	}
}
```

## Route Schema

```typescript
const LoginSchema = new RouteSchema({
	body: {}, // see supported validation below
	query: {}, // see supported validation below
	params: {} // see supported validation below

    // Optional metadata for documentation purposes
    meta: {
        tags: ['auth', 'login'],
        summary: 'User login endpoint',
        description: 'Endpoint for user login that validates input data',
    }
});
```

Using the above schema, you can define the route schema and type the `context` parameter in your handler to ensure type safety and validation.

```typescript
import { Controller, Post, HttpResponse } from '@zyrohub/module-router';

import { LoginSchema } from './schemas/LoginSchema.js';

@Controller({
	path: '/auth'
})
class AuthController {
	@Post('/login', LoginSchema)
	login(context: typeof LoginSchema.context) {
		const body = context.request.body; // Access typed and validated body
		const query = context.request.query; // Access typed and validated query
		const params = context.request.params; // Access typed and validated params

		// Your login logic here

		return HttpResponse.success({ token: '<generated_session_token>' });
	}
}
```

## Automatic Validation

You can use `zod`, `yup` or `class-validator` for automatic validation of request data.

### Using Zod

```typescript
import { z } from 'zod';

const LoginSchema = new RouteSchema({
	body: z.object({
		username: z.string().min(3),
		password: z.string().min(6)
	}),
	query: z.object({
		rememberMe: z.boolean().optional()
	}),
	params: z.object({
		userId: z.string().optional()
	})
});
```

### Using Yup

```typescript
import * as yup from 'yup';

const LoginSchema = new RouteSchema({
	body: yup.object().shape({
		username: yup.string().min(3).required(),
		password: yup.string().min(6).required()
	}),
	query: yup.object().shape({
		rememberMe: yup.boolean().notRequired()
	}),
	params: yup.object().shape({
		userId: yup.string().notRequired()
	})
});
```

### Using Class-Validator

```typescript
import { IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

class LoginBody {
	@IsString()
	@MinLength(3)
	username: string;

	@IsString()
	@MinLength(6)
	password: string;
}

class LoginQuery {
	@IsBoolean()
	@IsOptional()
	rememberMe?: boolean;
}

class LoginParams {
	@IsString()
	@IsOptional()
	userId?: string;
}

const LoginSchema = new RouteSchema({
	body: LoginBody,
	query: LoginQuery,
	params: LoginParams
});
```

## HttpResponse

The `HttpResponse` class provides static methods to create standardized HTTP responses.

```typescript
import { HttpResponse } from '@zyrohub/module-router';

// Successful response with data
const successResponse = HttpResponse.success({ userId: 1, username: 'john_doe' });
// { success: true, status: 200, data: { userId: 1, username: 'john_doe' } }

const createdResponse = HttpResponse.created({ resourceId: 123 });
// { success: true, status: 201, data: { resourceId: 123 } }

// Error response with message
const errorResponse = HttpResponse.error(401, 'UNAUTHORIZED', { message: 'Invalid credentials' });
// { success: false, status: 401, code: 'UNAUTHORIZED', data: { message: 'Invalid credentials' } }

// Error response with text status (e.g., 'BAD_REQUEST')
const errorResponseWithTextStatus = HttpResponse.error('BAD_REQUEST', 'INVALID_INPUT', {
	message: 'Input data is invalid'
});
// { success: false, status: 400, code: 'INVALID_INPUT', data: { message: 'Input data is invalid' } }
```

## Creating Middleware

You can create middleware by extending the `RouterMiddleware` class, using the `@Middleware()` decorator, and implementing the `execute` method.

```typescript
import { Middleware, RouterMiddleware, RouterMiddlewareContext, HttpResponse } from '@zyrohub/module-router';

export interface AuthMiddlewareOptions {
	secretKey: string;
}

@Middleware()
export class AuthMiddleware extends RouterMiddleware {
	// Your can add optional options to the middleware
	static options: AuthMiddlewareOptions;

	// Dependency injection can be used in the constructor
	constructor(
		// inject services or other dependencies here
		private readonly authService: AuthService
	) {
		super();
	}

	execute(context: RouterMiddlewareContext, options: AuthMiddlewareOptions) {
		const authHeader = context.request.headers['authorization'];

		if (!authHeader || !this.authService.verifyToken(authHeader, options.secretKey)) {
			return HttpResponse.error(401, 'INVALID_TOKEN', { message: 'Invalid or missing authorization token' });
		}

		// automatically proceed to the next middleware or route handler
	}
}
```

### Using Middleware in Controllers or Routes

```typescript
import { Controller, HttpResponse, Post, UseMiddleware } from '@zyrohub/module-router';

import { AnotherMiddleware } from './middlewares/AnotherMiddleware.js';
import { AuthMiddleware } from './middlewares/AuthMiddleware.js';
import { BuyItemSchema } from './schemas/BuyItemSchema.js';

@Controller({
	path: '/',
	// applying middlewares to all routes in the controller
	middlewares: [AnotherMiddleware]
})
class StoreController {
	@Post('/buy')
	// normal usage of middleware
	@UseMiddleware(AuthMiddleware)
	// usage of middleware with options
	@UseMiddleware(AuthMiddleware.configure({ secretKey: 'my_secret_key' }))
	// multiple middlewares
	@UseMiddleware(AnotherMiddleware, AuthMiddleware.configure({ secretKey: 'my_secret_key' }))
	buyItem(context: BuyItemSchema) {
		const { itemId, quantity } = context.request.body;

		// Your business logic for buying an item

		return HttpResponse.success({ itemId, quantity });
	}
}
```

## Getting generated routes

You can access the registered controllers and their routes from other modules or services by using the core storage or by accessing the `RouterModule` instance.

```typescript
import { BaseModule, Core, Module } from '@zyrohub/core';
import { DefinedController, ROUTER_CONTROLLERS_STORAGE_KEY } from '@zyrohub/module-router';

@Module()
class AnotherModule extends BaseModule {
	async init(data: { core: Core }) {
		// from core storage
		const controllers: DefinedController[] = data.core.storage.get(ROUTER_CONTROLLERS_STORAGE_KEY);
		console.log(controllers);

		// using the router module
		const routerModule = data.core.getModuleOrThrow(RouterModule);
		console.log(routerModule.controllers);
	}
}
```

## Declaring Request and Response types

You can declare your custom `request` and `response` types by using TypeScript module augmentation. This is useful when integrating with frameworks like Express or Fastify.

```typescript
// e.g., src/types/router.d.ts
import '@zyrohub/module-router';

declare module '@zyrohub/module-router' {
	interface RouterGlobalInputs {
		request: YourCustomRequestType; // e.g., Express.Request or FastifyRequest
		response: YourCustomResponseType; // e.g., Express.Response or FastifyReply
	}
}
```
