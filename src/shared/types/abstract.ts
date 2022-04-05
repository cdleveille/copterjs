export interface IScore {
	player: string,
	score: number
}

export interface IResponse {
	ok: boolean,
	status: number,
	data: any
}
export interface ISocket {
	connect: (params: ISocketParams) => ISocket,
	on: (listener: string, callback: (...params: any) => any) => void,
	emit: (listener: string, data?: any) => void,
	broadcast: ISocketBroadcast
}

interface ISocketParams {
	reconnectionDelay: number,
	reconnectionAttempts: number
}

interface ISocketBroadcast {
	emit: (listener: string, data?: any) => void,
}
