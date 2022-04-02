import Copter from "./copter.js";
import Terrain from "./terrain.js";
import { now } from "./util.js";
import socket from "./socket.js";
import { IScore } from "../../../build/shared/types/abstract";

export default class Game {
	width: number;
	height: number;
	copter: Copter;
	terrain: Terrain;
	pausedAtStart: boolean;
	locked: boolean;
	distanceLabel: HTMLDivElement;
	distanceValue: HTMLDivElement;
	bestLabel: HTMLDivElement;
	bestValue: HTMLDivElement;
	pilotLabel: HTMLDivElement;
	pilotValue: HTMLDivElement;
	highScoresLabel: HTMLDivElement;
	initialsSection: HTMLDivElement;
	initialsLabel: HTMLSpanElement;
	initialsForm: HTMLFormElement;
	initialsInput: HTMLInputElement;
	initialsInputCaret: HTMLDivElement;
	highScores: HTMLOListElement;
	isOver: boolean;
	startTime: number;
	endTime: number;
	distance: number;
	best: number;
	player: string;
	initialsRequested: boolean;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.distanceLabel = document.getElementById("distance-label") as HTMLDivElement;
		this.distanceValue = document.getElementById("distance-value") as HTMLDivElement;
		this.bestLabel = document.getElementById("best-label") as HTMLDivElement;
		this.bestValue = document.getElementById("best-value") as HTMLDivElement;
		this.pilotLabel = document.getElementById("pilot-label") as HTMLDivElement;
		this.pilotValue = document.getElementById("pilot-value") as HTMLDivElement;
		this.initialsSection = document.getElementById("initials-section") as HTMLDivElement;
		this.initialsLabel = document.getElementById("initials-label") as HTMLSpanElement;
		this.initialsForm = document.getElementById("initials-form") as HTMLFormElement;
		this.initialsInput = document.getElementById("initials-input") as HTMLInputElement;
		this.initialsInputCaret = document.getElementById("initials-input-caret") as HTMLDivElement;
		this.highScoresLabel = document.getElementById("high-scores-label") as HTMLDivElement;
		this.highScores = document.getElementById("high-scores") as HTMLOListElement;
		this.best = 0;
		this.player = window.localStorage.getItem("pilot");

		this.pilotLabel.onclick = () => this.pilotLabelClickHandler();
		this.highScoresLabel.onclick = () => this.highScoresLabelClickHandler();

		this.initSocket();
		this.initIntialsForm();
		this.init();
	}

	init() {
		this.pausedAtStart = true;
		this.locked = false;
		this.isOver = false;
		this.startTime = undefined;
		this.endTime = undefined;
		this.distance = 0;
		this.hideInitialsSection();

		this.copter.init();
		this.terrain.init();
	}

	initSocket() {
		socket.on("request_initials", () => this.getPlayerInitials(true));
		socket.on("show_new_high_score_msg", () => this.showNewHighScoreMsg());
		socket.on("high_scores_updated", (highScores) => this.updateHighScores(highScores));

		socket.emit("high_scores_request");
	}

	initIntialsForm() {
		this.initialsForm.addEventListener("submit", (e) => {
			e.preventDefault();
			if (this.initialsInput.value.length !== 3) return;

			this.player = this.initialsInput.value.toUpperCase();
			window.localStorage.setItem("pilot", this.player);
			this.initialsSubmitted();
		});

		this.initialsInput.addEventListener("input", (e) => {
			if (this.initialsInput.value.length === 0) {
				this.initialsInputCaret.style.display = "block";
				this.initialsInputCaret.style.left = "4%";
				return;
			}
			const lastChar = this.initialsInput.value[this.initialsInput.value.length - 1];
			if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(lastChar.toUpperCase()))
				this.initialsInput.value = this.initialsInput.value.toUpperCase().substring(0, this.initialsInput.value.length - 1);

			switch (this.initialsInput.value.length) {
				case 0:
					this.initialsInputCaret.style.display = "block";
					this.initialsInputCaret.style.left = "4%";
					break;
				case 1:
					this.initialsInputCaret.style.display = "block";
					this.initialsInputCaret.style.left = "36.5%";
					break;
				case 2:
					this.initialsInputCaret.style.display = "block";
					this.initialsInputCaret.style.left = "68.5%";
					break;
				default:
					this.initialsInputCaret.style.display = "none";
					break;
			}
		});

		this.initialsInput.addEventListener("focusout", (e) => {
			if (this.locked) this.initialsInput.focus();
		});
	}

	reportScore(justSubmittedInitials?: boolean) {
		const score: IScore = { player: this.player, score: this.distance };
		if (justSubmittedInitials) return socket.emit("validate_score_skip_msg", score);
		socket.emit("validate_score", score);
	}

	getPlayerInitials(onNewHighScore?: boolean) {
		this.locked = true;

		this.initialsInput.value = "";
		this.initialsLabel.innerText = onNewHighScore ? "NEW HIGH SCORE!\nENTER YOUR INITIALS:" : "ENTER YOUR INITIALS:";
		if (onNewHighScore) this.initialsRequested = true;

		this.initialsSection.style.display = "block";
		this.initialsForm.style.display = "block";
		this.initialsInput.style.display = "block";
		this.initialsInputCaret.style.display = "block";
		this.initialsInputCaret.style.left = "4%";

		this.initialsInput.focus();
	}

	initialsSubmitted() {
		if (this.initialsRequested) {
			this.reportScore(true);
			this.init();
		} else {
			this.hideInitialsSection();
		}
	}

	hideInitialsSection() {
		this.locked = false;
		this.initialsRequested = false;
		this.initialsSection.style.display = "none";
	}

	showNewHighScoreMsg() {
		this.initialsLabel.innerText = "NEW HIGH SCORE!";
		this.initialsSection.style.display = "block";
		this.initialsLabel.style.display = "block";
		this.initialsForm.style.display = "none";
	}

	pilotLabelClickHandler() {
		if (this.initialsRequested) return;
		if (this.locked) return this.hideInitialsSection();
		this.getPlayerInitials();
	}

	highScoresLabelClickHandler() {
		if (this.locked) return;
		this.highScores.style.display = this.highScores.style.display === "block" ? "none" : "block";
	}

	reset() {
		if (this.isOver && now() > this.endTime + 500) this.init();
	}

	resizeGameWindow(canvas: HTMLCanvasElement) {
		this.width = canvas.width;
		this.height = canvas.height;

		this.copter.x = this.width / 4;
		this.copter.y = this.height / 2 - this.copter.img.height / 2;

		this.distanceLabel.style.left = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.distanceLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 10}px`;

		this.bestLabel.style.right = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.bestLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 10}px`;

		this.pilotLabel.style.left = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.pilotLabel.style.top = `${((window.innerHeight - canvas.height) / 2) + 10}px`;

		this.highScoresLabel.style.right = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.highScoresLabel.style.top = `${((window.innerHeight - canvas.height) / 2) + 10}px`;
	}

	update(step: number) {
		this.terrain.update(step);
		this.copter.update(step);
	}

	updateHighScores(highScores: IScore[]) {
		let content = "", count = 1;
		for (const highScore of highScores) {
			content += `<li style="background: transparent;">${count < 10 ? "&nbsp;" + count : count}.&nbsp;${highScore.player}&nbsp;${highScore.score}</li>`;
			count++;
		}

		this.highScores.innerHTML = content;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.width, this.height);

		this.copter.draw(ctx);
		this.terrain.draw(ctx);

		this.distanceValue.innerText = this.distance.toString();
		this.bestValue.innerText = this.best.toString();
		this.pilotValue.innerText = this.player || "?";
	}
}
