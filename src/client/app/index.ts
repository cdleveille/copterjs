import Game from "./game.js";
import { now } from "./util.js";
import InputHandler from "./input.js";
import WindowHandler from "./window.js";

const canvas = <HTMLCanvasElement>document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

const game = new Game();
new InputHandler(canvas, game);
new WindowHandler(canvas, game);

let dt, current, last = now();
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
