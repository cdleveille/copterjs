import { Game } from "./game";
import { InputHandler } from "./input";
import { now } from "./util";
import { WindowHandler } from "./window";

if (!navigator.serviceWorker.controller) navigator.serviceWorker.register("sw.js");

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const game = new Game();
new InputHandler(canvas, game);
new WindowHandler(canvas, game);
game.init();

let dt: number,
	current: number,
	last = now();
const step = 1 / 500;

const frame = () => {
	current = now();
	dt = Math.min(1, (current - last) / 1000);
	while (dt > step) {
		dt = dt - step;
		game.update(step);
	}
	game.draw(ctx);
	last = current - (dt % step);
	requestAnimationFrame(frame);
};

requestAnimationFrame(frame);
