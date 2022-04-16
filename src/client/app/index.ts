import "../css/style.css";

import { Game } from "./game";
import { InputHandler } from "./input";
import { now } from "./util";
import { WindowHandler } from "./window";

// @ts-ignore
if (!navigator.serviceWorker.controller) {
	window.addEventListener("load", async () => {
		// @ts-ignore
		await navigator.serviceWorker.register("sw.js");
		console.log("service worker registered");
	});
} else console.log("active service worker found");

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const game = new Game();
new InputHandler(canvas, game);
new WindowHandler(canvas, game);
game.init();

let current: number,
	delta: number,
	last: number = now();

const frame = () => {
	current = now();
	delta = (current - last) / 1000;
	requestAnimationFrame(frame);
	game.update(delta);
	game.draw(ctx);
	last = current;
};

requestAnimationFrame(frame);
