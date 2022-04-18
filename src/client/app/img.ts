import { ICopterImgs } from "./types/abstract";
import { loadImage } from "./util";

export const imgs: ICopterImgs = {
	copterStopped: loadImage("/img/copter_stopped.png"),
	smoke: loadImage("/img/smoke.png"),
	flyImgs: [
		loadImage("/img/copter1.png"),
		loadImage("/img/copter2.png"),
		loadImage("/img/copter3.png"),
		loadImage("/img/copter4.png"),
		loadImage("/img/copter5.png"),
		loadImage("/img/copter6.png"),
		loadImage("/img/copter7.png"),
		loadImage("/img/copter8.png"),
		loadImage("/img/copter9.png"),
		loadImage("/img/copter10.png"),
		loadImage("/img/copter11.png"),
		loadImage("/img/copter12.png"),
		loadImage("/img/copter13.png"),
		loadImage("/img/copter14.png"),
		loadImage("/img/copter15.png"),
		loadImage("/img/copter16.png"),
		loadImage("/img/copter17.png"),
		loadImage("/img/copter18.png"),
		loadImage("/img/copter19.png"),
		loadImage("/img/copter20.png"),
		loadImage("/img/copter21.png"),
		loadImage("/img/copter22.png"),
		loadImage("/img/copter23.png"),
		loadImage("/img/copter24.png"),
		loadImage("/img/copter25.png")
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
