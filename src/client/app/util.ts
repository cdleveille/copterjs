import { IImg, IRect } from "./types/abstract";

export const now = (): number => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

export const loadImage = (url: string): IImg => {
	const img = new Image();
	img.src = url;
	const imgTracker: IImg = { img, isLoaded: false };
	// @ts-ignore
	img.onload = () => (imgTracker.isLoaded = true);
	return imgTracker;
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

export const toggleVisibility = (element: HTMLElement): boolean => {
	if (isVisible(element)) {
		setHidden(element);
		return false;
	}
	setVisible(element);
	return true;
};

export const setVisible = (element: HTMLElement) => {
	element.classList.remove("hidden");
	element.classList.add("visible");
};

export const setHidden = (element: HTMLElement) => {
	element.classList.remove("visible");
	element.classList.add("hidden");
};

export const isVisible = (element: HTMLElement): boolean => {
	return element.classList.contains("visible");
};

export const isHidden = (element: HTMLElement): boolean => {
	return element.classList.contains("hidden");
};

export const onMobile = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent);
};
