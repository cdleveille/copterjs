import { Game } from "./game";

export class InputHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		canvas.addEventListener("mousedown", (e) => {
			this.showCursor();
			if (e.button == 0) this.press(game);
		});

		document.getElementById("backdrop").addEventListener("mousedown", (e) => {
			this.showCursor();
			if (e.button == 0) this.press(game);
		});

		canvas.addEventListener("mouseup", (e) => {
			if (e.button == 0) this.release(game);
		});

		document.getElementById("backdrop").addEventListener("mouseup", (e) => {
			if (e.button == 0) this.release(game);
		});

		document.addEventListener("keydown", (e) => {
			this.hideCursor();

			if (e.repeat) return;
			switch (e.code) {
				case "Space":
					e.preventDefault();
					if (!game.locked) this.press(game);
					return;
				case "Digit1":
					e.preventDefault();
					return game.initialsForm.pilotLabelClickHandler();
				case "Digit2":
					e.preventDefault();
					return game.highScoresLabelClickHandler();
			}
		});

		document.addEventListener("keyup", (e) => {
			this.hideCursor();
			if (e.code === "Space") {
				e.preventDefault();
				this.release(game);
			}
		});

		canvas.addEventListener(
			"touchstart",
			() => {
				this.press(game);
			},
			{ passive: true }
		);

		document.getElementById("backdrop").addEventListener(
			"touchstart",
			() => {
				this.press(game);
			},
			{ passive: true }
		);

		canvas.addEventListener("touchend", (e) => {
			e.preventDefault();
			this.release(game);
		});

		document.getElementById("backdrop").addEventListener("touchend", (e) => {
			e.preventDefault();
			this.release(game);
		});

		document.addEventListener("mousemove", (e) => {
			this.showCursor();
		});
	}

	press(game: Game) {
		if (game.locked) return game.initialsForm.hide();
		if (game.pausedAtStart) game.pausedAtStart = false;
		if (game.isOver) return game.reset();
		if (game.highScores.style.display === "block") game.highScores.style.display = "none";
		game.copter.climbing = true;
		game.ping();
	}

	release(game: Game) {
		game.copter.climbing = false;
		game.ping();
	}

	hideCursor() {
		document.getElementById("container").style.cursor = "none";
	}

	showCursor() {
		document.getElementById("container").style.cursor = "auto";
	}
}
