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
	distanceLabel: HTMLElement;
	distanceValue: HTMLElement;
	bestLabel: HTMLElement;
	bestValue: HTMLElement;
	initialsSection: HTMLDivElement;
	initialsLabel: HTMLSpanElement;
	initialsForm: HTMLFormElement;
	initialsInput: HTMLInputElement;
	isOver: boolean;
	startTime: number;
	endTime: number;
	distance: number;
	best: number;
	player: string;

	constructor() {
		this.copter = new Copter(this);
		this.terrain = new Terrain(this);
		this.distanceLabel = document.getElementById("distance-label");
		this.distanceValue = document.getElementById("distance-value");
		this.bestLabel = document.getElementById("best-label");
		this.bestValue = document.getElementById("best-value");
		this.initialsSection = document.getElementById("initials-section") as HTMLDivElement;
		this.initialsLabel = document.getElementById("initials-label") as HTMLSpanElement;
		this.initialsForm = document.getElementById("initials-form") as HTMLFormElement;
		this.initialsInput = document.getElementById("initials-input") as HTMLInputElement;

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
		this.best = this.distance > this.best ? this.distance : this.best || 0;
		this.distance = 0;
		this.hideInitialsSection();

		this.copter.init();
		this.terrain.init();
	}

	initSocket() {
		socket.on("request_initials", () => this.getPlayerInitials());
		socket.on("new_high_score", () => this.showNewHighScoreText());
	}

	initIntialsForm() {
		this.initialsSection.style.display = "none";

		this.initialsForm.addEventListener("submit", (e) => {
			e.preventDefault();
			this.player = this.initialsInput.value.toUpperCase().substring(0, 3);
			this.reportScore(true);
			this.init();
		});

		this.initialsInput.addEventListener("input", (e) => {
			if (this.initialsInput.value.length < 1) return;

			if (this.initialsInput.value.length > 3)
				return this.initialsInput.value = this.initialsInput.value.toUpperCase().substring(0, 3);

			const lastChar = this.initialsInput.value[this.initialsInput.value.length - 1];
			if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(lastChar.toUpperCase()))
				this.initialsInput.value = this.initialsInput.value.toUpperCase().substring(0, this.initialsInput.value.length - 1);
		});
	}

	reportScore(justSubmittedInitials?: boolean) {
		const score: IScore = { player: this.player, score: this.distance };
		if (justSubmittedInitials) return socket.emit("validate_score_skip_msg", score);
		socket.emit("validate_score", score);
	}

	getPlayerInitials() {
		this.locked = true;
		this.initialsSection.style.display = "block";
		this.initialsInput.focus();
	}

	hideInitialsSection() {
		this.initialsSection.style.display = "none";
	}

	showNewHighScoreText() {
		this.initialsSection.style.display = "block";
		this.initialsLabel.style.display = "block";
		this.initialsForm.style.display = "none";
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
		this.distanceLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 12}px`;

		this.bestLabel.style.right = `${((window.innerWidth - canvas.width) / 2) + 100}px`;
		this.bestLabel.style.bottom = `${((window.innerHeight - canvas.height) / 2) + 12}px`;
	}

	update(step: number) {
		this.terrain.update(step);
		this.copter.update(step);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.width, this.height);

		this.copter.draw(ctx);
		this.terrain.draw(ctx);

		this.distanceValue.innerText = this.distance.toString();
		this.bestValue.innerText = this.best.toString();
	}
}
