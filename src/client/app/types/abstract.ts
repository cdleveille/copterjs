export interface ICoord {
	x: number;
	y: number;
}

export interface IArea {
	width: number;
	height: number;
}

export interface IRect extends ICoord, IArea {}

export interface ITunnel {
	x: number;
	xPct: number;
	lengthPct: number;
	topDepthPct: number;
	botDepthPct: number;
}

export interface IBlock extends ICoord {
	xPct: number;
	yPct: number;
	widthPct: number;
	heightPct: number;
}

export interface IHitboxOffset {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface ISocket extends ISocketBroadcast {
	id: string;
	connected: boolean;
	disconnected: boolean;
	connect: (params: ISocketParams) => ISocket;
	on: (listener: string, callback: (...params: any[]) => any) => void;
	broadcast: ISocketBroadcast;
}

interface ISocketBroadcast {
	emit: (listener: string, data?: any) => void;
}

interface ISocketParams {
	reconnectionDelay: number;
	reconnectionAttempts: number;
}
