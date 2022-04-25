// @ts-ignore
import copter1 from "../img/copter1.png";
// @ts-ignore
import copter10 from "../img/copter10.png";
// @ts-ignore
import copter11 from "../img/copter11.png";
// @ts-ignore
import copter12 from "../img/copter12.png";
// @ts-ignore
import copter13 from "../img/copter13.png";
// @ts-ignore
import copter14 from "../img/copter14.png";
// @ts-ignore
import copter15 from "../img/copter15.png";
// @ts-ignore
import copter16 from "../img/copter16.png";
// @ts-ignore
import copter17 from "../img/copter17.png";
// @ts-ignore
import copter18 from "../img/copter18.png";
// @ts-ignore
import copter19 from "../img/copter19.png";
// @ts-ignore
import copter2 from "../img/copter2.png";
// @ts-ignore
import copter20 from "../img/copter20.png";
// @ts-ignore
import copter21 from "../img/copter21.png";
// @ts-ignore
import copter22 from "../img/copter22.png";
// @ts-ignore
import copter23 from "../img/copter23.png";
// @ts-ignore
import copter24 from "../img/copter24.png";
// @ts-ignore
import copter25 from "../img/copter25.png";
// @ts-ignore
import copter3 from "../img/copter3.png";
// @ts-ignore
import copter4 from "../img/copter4.png";
// @ts-ignore
import copter5 from "../img/copter5.png";
// @ts-ignore
import copter6 from "../img/copter6.png";
// @ts-ignore
import copter7 from "../img/copter7.png";
// @ts-ignore
import copter8 from "../img/copter8.png";
// @ts-ignore
import copter9 from "../img/copter9.png";
// @ts-ignore
import copterStopped from "../img/copter_stopped.png";
// @ts-ignore
import lmb from "../img/lmb.svg";
// @ts-ignore
import smoke from "../img/smoke.png";
// @ts-ignore
import space from "../img/space.svg";
import { ICopterImgs } from "./types/abstract";
import { loadImage } from "./util";

const lmbImg = document.getElementById("lmb") as HTMLImageElement;
const lmbLoad = loadImage(lmb);
lmbImg.src = lmbLoad.img.src;

const spaceImg = document.getElementById("space") as HTMLImageElement;
const spaceLoad = loadImage(space);
spaceImg.src = spaceLoad.img.src;

export const imgs: ICopterImgs = {
	copterStopped: loadImage(copterStopped),
	smoke: loadImage(smoke),
	flyImgs: [
		loadImage(copter1),
		loadImage(copter2),
		loadImage(copter3),
		loadImage(copter4),
		loadImage(copter5),
		loadImage(copter6),
		loadImage(copter7),
		loadImage(copter8),
		loadImage(copter9),
		loadImage(copter10),
		loadImage(copter11),
		loadImage(copter12),
		loadImage(copter13),
		loadImage(copter14),
		loadImage(copter15),
		loadImage(copter16),
		loadImage(copter17),
		loadImage(copter18),
		loadImage(copter19),
		loadImage(copter20),
		loadImage(copter21),
		loadImage(copter22),
		loadImage(copter23),
		loadImage(copter24),
		loadImage(copter25)
	]
};

export const areAllImagesLoaded = (): boolean => {
	for (const img of imgs.flyImgs) {
		if (!img || !img.isLoaded) return false;
	}

	return imgs.copterStopped.isLoaded && imgs.smoke.isLoaded && lmbLoad.isLoaded && spaceLoad.isLoaded;
};
