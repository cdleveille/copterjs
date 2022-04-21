import { io, Socket } from "socket.io-client";

import { IEnv, IScore } from "@shared/types/abstract";

import { Copter } from "./copter";
import { areAllImagesLoaded } from "./img";
import { InitialsForm } from "./initials";
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
	bestLabel: HTMLDivElement;
	pilotLabel: HTMLDivElement;
	pilotLabelGhost: HTMLDivElement;
	highScoresLabel: HTMLDivElement;
	initialsForm: InitialsForm;
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
	allImagesLoaded: boolean;
	env: IEnv;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.initialsForm = new InitialsForm(this);
		this.best = 0;

		this.distanceLabel = document.getElementById("distance-label") as HTMLDivElement;
		this.bestLabel = document.getElementById("best-label") as HTMLDivElement;
		this.pilotLabel = document.getElementById("pilot-label") as HTMLDivElement;
		this.pilotLabelGhost = document.getElementById("pilot-label-ghost") as HTMLDivElement;
		this.highScoresLabel = document.getElementById("high-scores-label") as HTMLDivElement;
		this.highScores = document.getElementById("high-scores") as HTMLUListElement;
		this.overlay = document.getElementById("overlay") as HTMLDivElement;
		this.player = window.localStorage.getItem("player");

		this.pilotLabel.onclick = () => this.initialsForm.pilotLabelClickHandler();
		this.highScoresLabel.onclick = () => this.highScoresLabelClickHandler();

		navigator.onLine ? this.goOnline() : this.goOffline();
		this.initialsForm.init();
	}

	init() {
		this.pausedAtStart = true;
		this.locked = false;
		this.isOver = false;
		this.startTime = undefined;
		this.endTime = undefined;
		this.distance = 0;
		this.initialsRequested = false;

		this.initialsForm.hide();

		this.copter.init();
		this.terrain.init();
	}

	initNetwork() {
		if (!navigator.onLine) return;

		this.socket = io();

		this.socket.on("initials-request", () => this.initialsForm.show(true));
		this.socket.on("show-new-high-score-msg", () => this.initialsForm.showNewHighScoreMsg());
		this.socket.on("high-scores-updated", (highScores: IScore[]) => this.updateHighScores(highScores));
		this.socket.on("report-distance-to-client", (distance: number) => this.updateDistance(distance));
		this.socket.on("env-var-send", (env: IEnv) => this.processEnvVars(env));

		this.socket.emit("env-var-request");
	}

	processEnvVars(env: IEnv) {
		this.env = env;
		const online = "network: online";
		if (env.USE_DB) {
			console.log(`${online} (db connected)`);
			this.socket.emit("high-scores-request");
		} else {
			console.log(`${online} (db disconnected)`);
			this.noDB = true;
		}
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

	highScoresLabelClickHandler() {
		if (!this.initialsRequested) this.initialsForm.hide();
		if (this.locked) return;

		if (this.highScores.style.display === "block") return (this.highScores.style.display = "none");
		this.highScores.style.display = "block";

		if (!navigator.onLine || this.noDB) {
			const localHighScores = window.localStorage.getItem("high-scores");
			this.updateHighScores(JSON.parse(localHighScores) as IScore[]);
		}
	}

	reset() {
		if (this.isOver && now() > this.endTime + 1000) this.init();
	}

	resize(canvas: HTMLCanvasElement, ghostCanvas: HTMLCanvasElement) {
		this.width = ghostCanvas.width;
		this.height = ghostCanvas.height;

		const transformX = (window.innerWidth - this.width) / 2;
		const transformY = (window.innerHeight - this.height) / 2;

		canvas.style.transform = `translate(${transformX}px, ${transformY}px)`;

		this.overlay.style.left = `${transformX + this.width}px`;
		this.overlay.style.width = `${transformX * 4}px`;

		this.scale = this.width / 1600;

		const fontSizeScaled = `${60 * this.scale}px`;

		const offsetHorizontalPct = 0.07;
		const offsetVerticalPct = 0.013;

		const canvasDOMRect: DOMRect = ghostCanvas.getBoundingClientRect();

		const offsetHorizontal = `${canvasDOMRect.x + this.width * offsetHorizontalPct + transformX}px`;
		const offsetVertical = `${canvasDOMRect.y + this.height * offsetVerticalPct + transformY}px`;

		this.pilotLabel.style.fontSize = fontSizeScaled;
		this.pilotLabel.style.left = offsetHorizontal;
		this.pilotLabel.style.top = offsetVertical;

		this.pilotLabelGhost.style.fontSize = fontSizeScaled;
		this.pilotLabelGhost.style.left = offsetHorizontal;
		this.pilotLabelGhost.style.top = offsetVertical;

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

		this.initialsForm.resize();
		this.copter.resize();
		this.terrain.resize();
	}

	updateHighScores(highScores: IScore[]) {
		if (!highScores) return;

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
		this.socket = undefined;
	}

	updateTextIfChanged(text: string, element: HTMLElement, element2?: HTMLElement) {
		if (element.innerText !== text) {
			element.innerText = text;
			if (element2) element2.innerText = text;
		}
	}

	update(delta: number) {
		this.terrain.update(delta);
		this.copter.update(delta);
	}

	draw(ctx: CanvasRenderingContext2D) {
		// don't render the game screen until all images have loaded
		if (!this.allImagesLoaded) {
			this.allImagesLoaded = areAllImagesLoaded();
			if (!this.allImagesLoaded) return;
			document.getElementById("container").style.display = "block";
		}

		ctx.fillStyle = Color.black;
		ctx.fillRect(0, 0, this.width + 1, this.height);

		this.copter.draw(ctx);
		this.terrain.draw(ctx);

		this.updateTextIfChanged(`PILOT: ${this.player || "?"}`, this.pilotLabel, this.pilotLabelGhost);
		this.updateTextIfChanged("TOP 10", this.highScoresLabel);
		this.updateTextIfChanged(`DISTANCE: ${this.distance.toString()}`, this.distanceLabel);
		this.updateTextIfChanged(`BEST: ${this.best.toString()}`, this.bestLabel);
	}
}
