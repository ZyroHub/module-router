import { Readable } from 'node:stream';

export interface RouteSchemaContextFile {
	fieldName: string;
	fileName: string;
	mimeType: string;
	encoding: string;

	stream: Readable;
	toBuffer(): Promise<Buffer>;
	saveTo(destinationPath: string): Promise<void>;
}

export class RouteSchemaContextFiles extends Array<RouteSchemaContextFile> {
	constructor(items?: RouteSchemaContextFile[]) {
		if (typeof items === 'number') {
			super(items);
		} else {
			super(...(items || []));
		}

		Object.setPrototypeOf(this, RouteSchemaContextFiles.prototype);
	}

	getField(field_name: string): RouteSchemaContextFile[] {
		return this.filter(item => item.fieldName === field_name);
	}

	getFieldFirst(field_name: string): RouteSchemaContextFile | undefined {
		return this.find(item => item.fieldName === field_name);
	}
}
