// @ts-nocheck

import copter1 from "../img/copter1.png";
import copter10 from "../img/copter10.png";
import copter11 from "../img/copter11.png";
import copter12 from "../img/copter12.png";
import copter13 from "../img/copter13.png";
import copter14 from "../img/copter14.png";
import copter15 from "../img/copter15.png";
import copter16 from "../img/copter16.png";
import copter17 from "../img/copter17.png";
import copter18 from "../img/copter18.png";
import copter19 from "../img/copter19.png";
import copter2 from "../img/copter2.png";
import copter20 from "../img/copter20.png";
import copter21 from "../img/copter21.png";
import copter22 from "../img/copter22.png";
import copter23 from "../img/copter23.png";
import copter24 from "../img/copter24.png";
import copter25 from "../img/copter25.png";
import copter3 from "../img/copter3.png";
import copter4 from "../img/copter4.png";
import copter5 from "../img/copter5.png";
import copter6 from "../img/copter6.png";
import copter7 from "../img/copter7.png";
import copter8 from "../img/copter8.png";
import copter9 from "../img/copter9.png";
import copter_stopped from "../img/copter_stopped.png";
import smoke from "../img/smoke.png";
import { ICopterImgs } from "./types/abstract";
import { loadImage } from "./util";

export const imgs: ICopterImgs = {
	copterStopped: loadImage(copter_stopped),
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
