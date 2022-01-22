export const timestamp = () => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const loadImage = (url: string): HTMLImageElement => {
	const img = new Image();
	img.src = url;
	return img;
};

export interface ICoord {
	x: number,
	y: number
}
