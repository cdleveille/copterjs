/* eslint-disable no-undef */
import Game from "./game.js";
import { timestamp } from "./util.js";
import InputHandler from "./input.js";
import WindowHandler from "./window.js";

const canvas = <HTMLCanvasElement>document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

const game = new Game();
new InputHandler(canvas, game);
new WindowHandler(canvas, game);

let dt, now, last = timestamp();
const step = 1 / 500;

const frame = () => {
	now = timestamp();
	dt = Math.min(1, (now - last) / 1000);
	while (dt > step) {
		dt = dt - step;
		game.update(step);
	}
	game.draw(ctx);
	last = now - (dt % step);
	requestAnimationFrame(frame);
};

requestAnimationFrame(frame);
