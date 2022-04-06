import Game from "./game.js";

export default class InputHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		// document.oncontextmenu = (e) => {
		// 	e.preventDefault();
		// };

		canvas.addEventListener("mousedown", (e) => {
			if (e.button == 0) this.press(game);
		});

		document.getElementById("backdrop").addEventListener("mousedown", (e) => {
			if (e.button == 0) this.press(game);
		});

		canvas.addEventListener("mouseup", (e) => {
			if (e.button == 0) this.release(game);
		});

		document.getElementById("backdrop").addEventListener("mouseup", (e) => {
			if (e.button == 0) this.release(game);
		});

		document.addEventListener("keydown", (e) => {
			if (e.repeat) return;
			switch (e.code) {
				case "Space":
					e.preventDefault();
					return this.press(game);
				case "Tab":
					e.preventDefault();
					return game.highScoresLabelClickHandler();
				case "ShiftLeft":
					e.preventDefault();
					return game.pilotLabelClickHandler();
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.code === "Space") {
				e.preventDefault();
				this.release(game);
			}
		});

		canvas.addEventListener("touchstart", () => {
			this.press(game);
		});

		document.getElementById("backdrop").addEventListener("touchstart", () => {
			this.press(game);
		});

		canvas.addEventListener("touchend", (e) => {
			e.preventDefault();
			this.release(game);
		});

		document.getElementById("backdrop").addEventListener("touchend", (e) => {
			e.preventDefault();
			this.release(game);
		});
	}

	press(game: Game) {
		if (game.locked) return;
		if (game.pausedAtStart) game.pausedAtStart = false;
		if (game.isOver) return game.reset();
		game.copter.climbing = true;
		game.highScores.style.display = "none";
	}

	release(game: Game) {
		game.copter.climbing = false;
	}
}
