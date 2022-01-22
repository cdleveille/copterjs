import Copter from "./copter.js";

export default class Game {
	gameWidth: number;
	gameHeight: number;
	copter: Copter;
	paused: boolean;

	constructor() {
		this.copter = new Copter(this);
		this.init();
	}

	init() {
		this.paused = true;
		this.copter.init();
	}

	resizeCanvas(newWidth: number, newHeight: number) {
		this.gameWidth = newWidth;
		this.gameHeight = newHeight;

		if (this.paused) {
			this.copter.x = window.innerWidth / 4;
			this.copter.y = window.innerHeight / 2;
		}
	}

	update(step: number) {
		this.copter.update(step);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

		this.copter.draw(ctx);
	}
}
