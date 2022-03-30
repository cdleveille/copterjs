import Copter from "./copter.js";
import Terrain from "./terrain.js";

export default class Game {
	width: number;
	height: number;
	copter: Copter;
	terrain: Terrain;
	paused: boolean;
	distanceLabel: HTMLElement;
	distanceValue: HTMLElement;
	bestLabel: HTMLElement;
	bestValue: HTMLElement;
	isOver: boolean;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.distanceLabel = document.getElementById("distance-label");
		this.distanceValue = document.getElementById("distance-value");
		this.bestLabel = document.getElementById("best-label");
		this.bestValue = document.getElementById("best-value");
		this.init();
	}

	init() {
		this.paused = true;
		this.isOver = false;
		this.copter.init();
		this.terrain.init();
	}

	resizeGameWindow(canvas: HTMLCanvasElement) {
		this.width = canvas.width;
		this.height = canvas.height;

		this.copter.x = this.width / 4;
		this.copter.y = this.height / 2 - this.copter.img.height / 2;

		this.distanceLabel.style.left = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.distanceLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 12}px`;

		this.bestLabel.style.right = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.bestLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 12}px`;
	}

	update(step: number) {
		if (this.isOver) return;

		this.terrain.update(step);
		this.copter.update(step);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.width, this.height);

		this.copter.drawSmoke(ctx);
		this.terrain.draw(ctx);
		this.copter.draw(ctx);

		this.distanceValue.innerText = this.copter.distance.toString();
		this.bestValue.innerText = this.copter.best.toString();
	}
}
