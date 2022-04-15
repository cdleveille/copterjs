export interface IScore {
	player: string;
	score: number;
}

export interface IEnv {
	IS_PROD: boolean;
	USE_DB: boolean;
}
