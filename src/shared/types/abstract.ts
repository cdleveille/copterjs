export interface IScore {
	player: string,
	score: number
}

export interface IResponse {
	ok: boolean,
	status: number,
	data: any
}

export interface ServerToClientEvents {
	hello: (a: number) => number;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

export interface ISocket {
	connect: (params: ISocketParams) => ISocket,
	on: (listener: string, callback: (...params: any) => any) => void,
	emit: (listener: string, data?: any) => void
}

interface ISocketParams {
	reconnectionDelay: number,
	reconnectionAttempts: number
}
