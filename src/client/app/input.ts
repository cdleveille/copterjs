import { Game } from "./game";
import { isVisible, setHidden } from "./util";

export class InputHandler {
	constructor(game: Game) {
		const backdrop = document.getElementById("backdrop");

		document.oncontextmenu = (e: MouseEvent) => {
			e.preventDefault();
		};

		backdrop.addEventListener("mousedown", (e: MouseEvent) => {
			this.showCursor();
			if (e.button == 0) this.press(game);
		});

		backdrop.addEventListener("mouseup", (e: MouseEvent) => {
			if (e.button == 0) this.release(game);
		});

		document.addEventListener("keydown", (e: KeyboardEvent) => {
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
				case "Enter":
					e.preventDefault();
					return game.initialsForm.submit();
			}
		});

		document.addEventListener("keyup", (e: KeyboardEvent) => {
			if (e.code === "Space") {
				e.preventDefault();
				this.release(game);
			}
		});

		backdrop.addEventListener(
			"touchstart",
			() => {
				this.press(game);
			},
			{ passive: true }
		);

		backdrop.addEventListener("touchend", (e: TouchEvent) => {
			e.preventDefault();
			this.release(game);
		});

		document.addEventListener("mousemove", () => {
			this.showCursor();
		});
	}

	press(game: Game) {
		if (game.locked) return game.initialsForm.hide();
		if (game.pausedAtStart) game.pausedAtStart = false;
		if (game.isOver) return game.reset();
		if (isVisible(game.highScores)) setHidden(game.highScores);
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
