import { Game } from "./game";
import { now, onMobile, setHidden, setVisible } from "./util";

export class InitialsForm {
	game: Game;
	initialsSection: HTMLDivElement;
	initialsLabel: HTMLSpanElement;
	initialsForm: HTMLFormElement;
	initialsInput: HTMLInputElement;
	initialsInputCaret: HTMLDivElement;
	initialsSubmitLabel: HTMLDivElement;

	constructor(game: Game) {
		this.game = game;
		this.initialsSection = document.getElementById("initials-section") as HTMLDivElement;
		this.initialsLabel = document.getElementById("initials-label") as HTMLSpanElement;
		this.initialsForm = document.getElementById("initials-form") as HTMLFormElement;
		this.initialsInput = document.getElementById("initials-input") as HTMLInputElement;
		this.initialsInputCaret = document.getElementById("initials-input-caret") as HTMLDivElement;
		this.initialsSubmitLabel = document.getElementById("initials-submit-label") as HTMLDivElement;
	}

	init() {
		this.initialsSubmitLabel.innerText = "⏎";

		this.initialsInput.onselectstart = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.onpaste = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.oncopy = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.oncut = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.ondrag = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.ondrop = (e) => {
			e.preventDefault();
			return false;
		};
		this.initialsInput.oncontextmenu = (e) => {
			e.preventDefault();
			return false;
		};

		this.initialsForm.addEventListener("submit", (e) => {
			e.preventDefault();
			this.submit();
		});

		this.initialsInput.addEventListener("focusin", () => {
			this.initialsInput.inputMode = "text";
			if (this.initialsInput.value.length === 3) {
				this.initialsInputCaret.style.display = "none";
				this.initialsSubmitLabel.style.animation = "blink-bright 1s infinite";
			} else {
				this.initialsInputCaret.style.display = "block";
			}
		});

		this.initialsInput.addEventListener("focusout", () => this.hide());

		if (onMobile()) {
			this.initialsInput.addEventListener("input", () => {
				this.initialsInput.value = this.initialsInput.value.toUpperCase();

				for (const char of this.initialsInput.value) {
					if (!char.toUpperCase().match(/^[A-Z]$/)) {
						this.initialsInput.value = this.initialsInput.value.replace(char, "");
					}
				}

				this.updateCaretAndSubmitLabel(this.initialsInput.value.length);
			});

			this.initialsInput.addEventListener("keydown", () => {
				this.initialsInput.selectionStart = this.initialsInput.value.length;
				this.initialsInput.selectionEnd = this.initialsInput.value.length;
			});
		} else {
			document.addEventListener("selectionchange", () => {
				this.updateCaretAndSubmitLabel(this.initialsInput.selectionStart);
			});

			this.initialsInput.addEventListener("beforeinput", (e) => {
				if (!e.data) return;
				if (!e.data.toUpperCase().match(/^[A-Z]$/)) e.preventDefault();
			});

			this.initialsInput.addEventListener("input", (e: InputEvent) => {
				if (e.inputType.startsWith("deleteContent")) {
					this.updateCaretAndSubmitLabel(this.initialsInput.selectionStart);
				}
			});
		}
	}

	submit() {
		if (!this.game.locked) return;
		if (this.initialsInput.value.length !== 3) return;

		this.game.player = this.initialsInput.value.toUpperCase();
		window.localStorage.setItem("player", this.game.player);

		if (this.game.initialsRequested) {
			this.game.submitScore();
			this.game.init();
		} else {
			this.hide();
		}
	}

	updateCaretAndSubmitLabel(caretPos: number) {
		if (this.initialsInput.value.length === 3) {
			this.initialsSubmitLabel.style.animation = "blink-bright 1s infinite";
		} else {
			this.initialsSubmitLabel.style.animation = "";
		}

		this.setCaretPos(caretPos);
	}

	setCaretPos(pos: number) {
		switch (pos) {
			case 0:
				this.initialsInputCaret.style.left = "4%";
				this.initialsInputCaret.style.display = "block";
				break;
			case 1:
				this.initialsInputCaret.style.left = "36%";
				this.initialsInputCaret.style.display = "block";
				break;
			case 2:
				this.initialsInputCaret.style.left = "68%";
				this.initialsInputCaret.style.display = "block";
				break;
			default:
				this.initialsInputCaret.style.display = "none";
				break;
		}
	}

	show(onNewHighScore?: boolean) {
		this.game.locked = true;

		this.initialsInput.value = "";
		this.initialsInput.inputMode = "text";

		this.initialsLabel.innerText = onNewHighScore
			? "NEW HIGH SCORE!\nENTER YOUR INITIALS:"
			: "ENTER YOUR INITIALS:";

		if (onNewHighScore) this.game.initialsRequested = true;

		this.setCaretPos(0);
		this.initialsSubmitLabel.style.opacity = "0";
		this.initialsSubmitLabel.style.animation = "";

		this.scrollToForm();

		setHidden(this.game.highScores);
		setHidden(this.game.controls);
		setVisible(this.initialsSection);
		this.initialsForm.style.display = "block";
		this.initialsInput.style.display = "block";
		this.initialsSubmitLabel.style.display = "block";

		this.initialsInput.focus();
	}

	hide() {
		if (this.game.isOver && now() - this.game.endTime < 1000) return this.initialsInput.focus();
		this.initialsInput.inputMode = "none";
		if (this.game.initialsRequested) return;

		this.initialsInput.inputMode = "none";
		this.game.locked = false;
		this.game.initialsRequested = false;
		setHidden(this.initialsSection);
		this.game.pilotLabel.style.pointerEvents = "auto";
		if (this.game.pausedAtStart) setVisible(this.game.controls);
	}

	showNewHighScoreMsg() {
		this.initialsLabel.innerText = "NEW HIGH SCORE!";

		setHidden(this.game.highScores);
		setVisible(this.initialsSection);
		this.initialsForm.style.display = "none";
		this.initialsInput.style.display = "none";
		this.initialsSubmitLabel.style.display = "none";
	}

	pilotLabelClickHandler() {
		if (this.game.initialsRequested) return;
		this.game.pilotLabel.style.pointerEvents = "none";
		if (this.game.locked) return this.hide();
		this.show();
	}

	resize() {
		const fontSizeScaled = `${60 * this.game.scale}px`;
		const initialsInputFontSizeScaled = `${166 * this.game.scale}px`;
		const initialsInputWidth = `${236 * this.game.scale}px`;
		const initialsInputBorderWidth = `${4 * this.game.scale}px`;
		const initialsFormMarginTop = `${16 * this.game.scale}px`;
		const initialsFormMarginBottom = `${5 * this.game.scale}px`;

		this.initialsSection.style.fontSize = fontSizeScaled;
		this.initialsInput.style.fontSize = initialsInputFontSizeScaled;

		this.initialsInput.style.width = initialsInputWidth;
		this.initialsInput.style.borderWidth = initialsInputBorderWidth;

		this.initialsForm.style.marginTop = initialsFormMarginTop;
		this.initialsForm.style.marginBottom = initialsFormMarginBottom;

		this.initialsSubmitLabel.style.fontSize = fontSizeScaled;
	}

	scrollToForm() {
		const rect = this.initialsSection.getBoundingClientRect();
		window.scrollTo(rect.x, rect.y);
	}
}
