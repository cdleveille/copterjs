import { FilterQuery, Model, PopulateOptions, QueryOptions } from "mongoose";

import { IScore } from "@shared/types/abstract";

export interface IBase {
	created_at: Date;
	updated_at: Date;
}

export interface IRun {
	startTime: number;
	endTime: number;
	lastPing: number;
}

export interface IResponse {
	ok: boolean;
	status: number;
	data: any;
}

export interface IBaseModel<T extends IBase = IBase> extends Model<T> {
	assertFindOne(filter?: FilterQuery<T>, options?: Options<T>, projection?: Projection): Promise<T>;
	assertFind(filter?: FilterQuery<T>, options?: Options<T>, projection?: Projection): Promise<T[]>;
	createOrUpdate(filter: FilterQuery<T>, doc: Partial<T>): Promise<T>;
	assertExists(filter: FilterQuery<T>, options?: Options<T>): Promise<void>;
	getCount(filter: FilterQuery<T>, options?: Options<T>): Promise<number>;
}

interface IScoreXt extends IBase, IScore {}

export type IScoreModel = IBaseModel<IScoreXt>;

export type Projection = Record<string, 0 | 1>;

export interface Options<T extends IBase = IBase> extends QueryOptions {
	sort?: {
		// eslint-disable-next-line no-unused-vars
		[k in keyof Partial<T>]: 1 | -1 | number;
	};
	populate?: PopulateOptions[];
	limit?: number;
	skip?: number;
	new?: boolean;
}
