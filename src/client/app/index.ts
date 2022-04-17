import { Game } from "./game";
import { areAllImagesLoaded } from "./img";
import { InputHandler } from "./input";
import { now } from "./util";
import { WindowHandler } from "./window";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const game = new Game();
new InputHandler(canvas, game);
const windowHandler = new WindowHandler(canvas, game);
game.init();

window.addEventListener("load", async () => {
	// @ts-ignore
	if (!navigator.serviceWorker.controller) {
		// @ts-ignore
		await navigator.serviceWorker.register("sw.js");
		console.log("new service worker registered");
	} else console.log("active service worker found");

	canvas.style.display = "block";
	windowHandler.resize();
});

let current: number,
	delta: number,
	last: number = now(),
	allImagesLoaded = false;

const frame = () => {
	current = now();
	delta = (current - last) / 1000;
	requestAnimationFrame(frame);
	game.update(delta);
	if (allImagesLoaded || areAllImagesLoaded()) {
		allImagesLoaded = true;
		game.draw(ctx);
	}
	last = current;
};

requestAnimationFrame(frame);
