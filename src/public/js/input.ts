import Game from "./game.js";

export default class InputHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		canvas.oncontextmenu = (e) => {
			e.preventDefault();
		};

		canvas.addEventListener("mousedown", (e) => {
			if (e.button == 0) {
				if (game.paused) game.paused = false;
				game.copter.climbing = true;
			}
		});

		canvas.addEventListener("mouseup", (e) => {
			if (e.button == 0) {
				game.copter.climbing = false;
			}
		});

		document.addEventListener("keydown", (e) => {
			if (!e.repeat && e.code === "Space") {
				if (game.paused) game.paused = false;
				game.copter.climbing = true;
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.code === "Space") {
				game.copter.climbing = false;
			}
		});

		canvas.addEventListener("touchstart", (e) => {
			if (game.paused) game.paused = false;
			e.preventDefault();
			game.copter.climbing = true;
		});

		canvas.addEventListener("touchend", (e) => {
			e.preventDefault();
			game.copter.climbing = false;
		});
	}
}
