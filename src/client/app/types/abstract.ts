export interface ICoord {
	x: number,
	y: number
}

export interface IArea {
	width: number,
	height: number
}

export interface IRect extends ICoord, IArea { }

export interface ITunnel {
	x: number,
	xPct: number,
	lengthPct: number,
	topDepthPct: number,
	botDepthPct: number
}

export interface IHitboxOffset {
	left: number,
	right: number,
	top: number,
	bottom: number
}
