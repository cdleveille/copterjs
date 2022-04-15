import { io, Socket } from "socket.io-client";

import { IEnv, IScore } from "@shared/types/abstract";

import { Copter } from "./copter";
import { Terrain } from "./terrain";
import { Color } from "./types/constant";
import { now } from "./util";

export class Game {
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
	highScores: HTMLUListElement;
	overlay: HTMLDivElement;
	isOver: boolean;
	startTime: number;
	endTime: number;
	distance: number;
	best: number;
	player: string;
	initialsRequested: boolean;
	scale: number;
	socket: Socket;
	noDB: boolean;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.best = 0;

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
		this.highScores = document.getElementById("high-scores") as HTMLUListElement;
		this.overlay = document.getElementById("overlay") as HTMLDivElement;
		this.player = window.localStorage.getItem("player");

		this.pilotLabel.style.display = "block";
		this.highScoresLabel.style.display = "block";
		this.distanceLabel.style.display = "block";
		this.bestLabel.style.display = "block";

		this.pilotLabel.onclick = () => this.pilotLabelClickHandler();
		this.highScoresLabel.onclick = () => this.highScoresLabelClickHandler();

		navigator.onLine ? this.goOnline() : this.goOffline();
		this.initIntialsForm();
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

	initNetwork() {
		if (!navigator.onLine) return;

		this.socket = io();

		this.socket.on("initials-request", () => this.getPlayerInitials(true));
		this.socket.on("show-new-high-score-msg", () => this.showNewHighScoreMsg());
		this.socket.on("high-scores-updated", (highScores: IScore[]) => this.updateHighScores(highScores));
		this.socket.on("report-distance-to-client", (distance: number) => this.updateDistance(distance));
		this.socket.on("env-var-send", (env: IEnv) => this.processEnvVars(env));

		this.socket.emit("env-var-request");
	}

	processEnvVars(env: IEnv) {
		const online = "network: online";
		if (env.USE_DB) {
			console.log(`${online} (db connected)`);
			this.socket.emit("high-scores-request");
		} else {
			console.log(`${online} (db disconnected)`);
			this.noDB = true;
		}
	}

	initIntialsForm() {
		this.initialsForm.addEventListener("submit", (e) => {
			e.preventDefault();
			if (this.initialsInput.value.length !== 3) return;

			this.player = this.initialsInput.value;
			window.localStorage.setItem("player", this.player);
			this.initialsSubmitted();
		});

		this.initialsInput.addEventListener("input", () => {
			this.initialsInput.value = this.initialsInput.value.toUpperCase();

			if (this.initialsInput.value.length === 0) {
				this.initialsInputCaret.style.display = "block";
				this.initialsInputCaret.style.left = "4%";
				return;
			}

			const lastChar = this.initialsInput.value[this.initialsInput.value.length - 1];
			if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(lastChar))
				this.initialsInput.value = this.initialsInput.value.substring(0, this.initialsInput.value.length - 1);

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

		this.initialsInput.addEventListener("focusout", () => {
			if (this.locked) this.initialsInput.focus();
		});
	}

	endRun(distance: number) {
		if (this.noDB || !navigator.onLine) return;
		this.socket.emit("end-run", { player: this.player, score: distance });
	}

	submitScore() {
		if (this.noDB || !navigator.onLine) return;
		this.socket.emit("submit-score", this.player);
	}

	updateDistance(distance: number) {
		this.distance = distance;
		this.best = this.distance > this.best ? this.distance : this.best;
	}

	ping() {
		if (this.noDB || !navigator.onLine || this.pausedAtStart || this.isOver) return;
		this.socket.emit("player-input-ping");
	}

	getPlayerInitials(onNewHighScore?: boolean) {
		this.locked = true;
		this.highScores.style.display = "none";

		this.initialsInput.value = "";
		this.initialsLabel.innerText = onNewHighScore
			? "NEW HIGH SCORE!\nENTER YOUR INITIALS:"
			: "ENTER YOUR INITIALS:";
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
			this.submitScore();
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
		this.highScores.style.display = "none";
	}

	pilotLabelClickHandler() {
		if (this.initialsRequested) return;
		if (this.locked) return this.hideInitialsSection();
		this.getPlayerInitials();
	}

	highScoresLabelClickHandler() {
		if (!this.initialsRequested) this.hideInitialsSection();
		if (this.locked) return;

		if (this.highScores.style.display === "block") return (this.highScores.style.display = "none");
		this.highScores.style.display = "block";

		if (!navigator.onLine || this.noDB) {
			const localHighScores = window.localStorage.getItem("high-scores");
			this.updateHighScores(JSON.parse(localHighScores) as IScore[]);
		}
	}

	reset() {
		if (this.isOver && now() > this.endTime + 500) this.init();
	}

	resize(canvas: HTMLCanvasElement, ghostCanvas: HTMLCanvasElement) {
		this.width = ghostCanvas.width;
		this.height = ghostCanvas.height;

		const transformX = (window.innerWidth - this.width) / 2;
		const transformY = (window.innerHeight - this.height) / 2;

		canvas.style.transform = `translate(${transformX}px, ${transformY}px)`;

		this.overlay.style.left = `${transformX + this.width}px`;
		this.overlay.style.width = `${transformX}px`;

		this.scale = this.width / 1600;

		const fontSizeScaled = `${60 * this.scale}px`;
		const intialsInputFontSizeScaled = `${166 * this.scale}px`;
		const initialsInputWidth = `${234 * this.scale}px`;
		const initialsInputBorderWidth = `${4 * this.scale}px`;
		const initialsFormMarginTop = `${16 * this.scale}px`;

		const offsetHorizontalPct = 0.07;
		const offsetVerticalPct = 0.013;

		const canvasDOMRect: DOMRect = ghostCanvas.getBoundingClientRect();

		const offsetHorizontal = `${canvasDOMRect.x + this.width * offsetHorizontalPct + transformX}px`;
		const offsetVertical = `${canvasDOMRect.y + this.height * offsetVerticalPct + transformY}px`;

		this.pilotLabel.style.fontSize = fontSizeScaled;
		this.pilotLabel.style.left = offsetHorizontal;
		this.pilotLabel.style.top = offsetVertical;

		this.highScoresLabel.style.fontSize = fontSizeScaled;
		this.highScoresLabel.style.right = offsetHorizontal;
		this.highScoresLabel.style.top = offsetVertical;

		this.distanceLabel.style.fontSize = fontSizeScaled;
		this.distanceLabel.style.left = offsetHorizontal;
		this.distanceLabel.style.bottom = offsetVertical;

		this.bestLabel.style.fontSize = fontSizeScaled;
		this.bestLabel.style.right = offsetHorizontal;
		this.bestLabel.style.bottom = offsetVertical;

		this.highScores.style.fontSize = fontSizeScaled;
		this.initialsSection.style.fontSize = fontSizeScaled;
		this.initialsInput.style.fontSize = intialsInputFontSizeScaled;

		this.initialsInput.style.width = initialsInputWidth;
		this.initialsInput.style.borderWidth = initialsInputBorderWidth;

		this.initialsForm.style.marginTop = initialsFormMarginTop;

		this.copter.resize();
		this.terrain.resize();
	}

	updateHighScores(highScores: IScore[]) {
		let content = "",
			count = 1;
		for (const highScore of highScores) {
			content += `<li style="background: transparent;">
				${count < 10 ? "&nbsp;" + count : count}.&nbsp;
				${highScore.player}&nbsp;&nbsp;${highScore.score}</li>`;
			count++;
		}

		this.highScores.innerHTML = content;
		window.localStorage.setItem("high-scores", JSON.stringify(highScores));
	}

	goOnline() {
		this.initNetwork();
	}

	goOffline() {
		console.log("network: offline (db disconnected)");
	}

	update(step: number) {
		this.terrain.update(step);
		this.copter.update(step);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = Color.black;
		ctx.fillRect(0, 0, this.width + 1, this.height);

		this.copter.draw(ctx);
		this.terrain.draw(ctx);

		this.distanceValue.innerText = this.distance.toString();
		this.bestValue.innerText = this.best.toString();
		this.pilotValue.innerText = this.player || "?";
	}
}
