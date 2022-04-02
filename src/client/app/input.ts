import Game from "./game.js";

export default class InputHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		canvas.oncontextmenu = (e) => {
			e.preventDefault();
		};

		canvas.addEventListener("mousedown", (e) => {
			if (e.button == 0) {
				this.press(game);
			}
		});

		canvas.addEventListener("mouseup", (e) => {
			if (e.button == 0) {
				this.release(game);
			}
		});

		document.addEventListener("keydown", (e) => {
			if (!e.repeat && e.code === "Space") {
				this.press(game);
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.code === "Space") {
				this.release(game);
			}
		});

		canvas.addEventListener("touchstart", (e) => {
			this.press(game);
		});

		canvas.addEventListener("touchend", (e) => {
			e.preventDefault();
			this.release(game);
		});
	}

	press(game: Game) {
		if (game.locked) return;
		if (game.pausedAtStart) game.pausedAtStart = false;
		if (game.isOver) game.reset();
		game.copter.climbing = true;
	}

	release(game: Game) {
		game.copter.climbing = false;
	}
}
