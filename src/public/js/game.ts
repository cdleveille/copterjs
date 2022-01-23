import Copter from "./copter.js";
import Terrain from "./terrain.js";

export default class Game {
	gameWidth: number;
	gameHeight: number;
	copter: Copter;
	terrain: Terrain;
	paused: boolean;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.init();
	}

	init() {
		this.paused = true;
		this.copter.init();
		this.terrain.init();
	}

	resizeGameWindow() {
		this.copter.x = window.innerWidth / 4;
		this.copter.y = window.innerHeight / 2 - this.copter.img.height / 2;
	}

	update(step: number) {
		this.terrain.update(step);
		this.copter.update(step);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

		this.terrain.draw(ctx);

		this.copter.draw(ctx);
	}
}
