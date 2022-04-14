import { IRect } from "./types/abstract";

export const now = (): number => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const loadImage = (url: string): HTMLImageElement => {
	const img = new Image();
	img.src = url;
	return img;
};

export const areRectanglesColliding = (rect1: IRect, rect2: IRect): boolean => {
	return (
		rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y
	);
};

// generate random integer in specified range (min inclusive, max exclusive)
export const randomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
};

export class Counter {
	count: number;
	timestamp: number;
	msLimit: number;
	label: string;

	constructor(msLimit: number, label: string) {
		this.msLimit = msLimit;
		this.label = label;
	}

	update(): Counter {
		if (!this.timestamp) {
			this.timestamp = now();
			this.count = 1;
		} else {
			this.count++;
			if (now() - this.timestamp >= this.msLimit) {
				console.log(`${this.label}: ${this.count}`);
				this.timestamp = undefined;
			}
		}
		return this;
	}
}
