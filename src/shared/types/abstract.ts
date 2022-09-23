export interface IScore {
	player: string;
	score: number;
}

export interface IEnv {
	IS_PROD: boolean;
	USE_DB: boolean;
}

export interface IResponse<T> {
	ok: boolean;
	status: number;
	data: T;
}
