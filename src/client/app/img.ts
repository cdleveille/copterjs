import { ICopterImgs } from "./types/abstract";
import { loadImage } from "./util";

export const imgs: ICopterImgs = {
	copterStopped: loadImage("assets/copter_stopped.png"),
	smoke: loadImage("assets/smoke.png"),
	flyImgs: [
		loadImage("assets/copter1.png"),
		loadImage("assets/copter2.png"),
		loadImage("assets/copter3.png"),
		loadImage("assets/copter4.png"),
		loadImage("assets/copter5.png"),
		loadImage("assets/copter6.png"),
		loadImage("assets/copter7.png"),
		loadImage("assets/copter8.png"),
		loadImage("assets/copter9.png"),
		loadImage("assets/copter10.png"),
		loadImage("assets/copter11.png"),
		loadImage("assets/copter12.png"),
		loadImage("assets/copter13.png"),
		loadImage("assets/copter14.png"),
		loadImage("assets/copter15.png"),
		loadImage("assets/copter16.png"),
		loadImage("assets/copter17.png"),
		loadImage("assets/copter18.png"),
		loadImage("assets/copter19.png"),
		loadImage("assets/copter20.png"),
		loadImage("assets/copter21.png"),
		loadImage("assets/copter22.png"),
		loadImage("assets/copter23.png"),
		loadImage("assets/copter24.png"),
		loadImage("assets/copter25.png")
	]
};

export const areAllImagesLoaded = (): boolean => {
	for (const img of imgs.flyImgs) {
		// @ts-ignore
		if (!img || !img.isLoaded) return false;
	}
	// @ts-ignore
	return imgs.copterStopped.isLoaded && imgs.smoke.isLoaded;
};
