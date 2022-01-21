/* eslint-disable no-undef */
import { Game } from "./game";
import { timestamp } from "./util";

const canvas = <HTMLCanvasElement>document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

const game = new Game();
// new InputHandler(canvas, game);
// new WindowHandler(canvas, game);

let dt, now, last = timestamp();
const step = 1 / 500;

const frame = () => {
	now = timestamp();
	console.log("hit");
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
