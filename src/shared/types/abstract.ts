export interface IScore {
	player: string,
	score: number
}

export interface IResponse {
	ok: boolean,
	status: number,
	data: any
}
export interface ISocket extends ISocketBroadcast {
	connect: (params: ISocketParams) => ISocket,
	on: (listener: string, callback: (...params: any) => any) => void,
	broadcast: ISocketBroadcast
}

interface ISocketParams {
	reconnectionDelay: number,
	reconnectionAttempts: number
}

interface ISocketBroadcast {
	emit: (listener: string, data?: any) => void,
}
