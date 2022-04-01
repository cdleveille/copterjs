export const now = () => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const loadImage = (url: string): HTMLImageElement => {
	const img = new Image();
	img.src = url;
	return img;
};

export const areRectanglesColliding = (rect1: IRect, rect2: IRect): boolean => {
	return (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y);
};

export interface ICoord {
	x: number,
	y: number
}

export interface IRect extends ICoord {
	width: number,
	height: number
}

export interface ITunnel {
	x: number,
	length: number,
	topDepth: number
	botDepth: number
}

export interface IHitboxOffset {
	left: number,
	right: number,
	top: number,
	bottom: number
}