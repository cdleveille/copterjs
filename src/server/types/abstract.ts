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
