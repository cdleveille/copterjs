import Game from "./game.js";
import { ICoord, IRect, IHitboxOffset, loadImage, areRectanglesColliding, now } from "./util.js";

export default class Copter {
	game: Game;
	x: number;
	y: number;
	width: number;
	height: number;
	xv: number;
	yv: number;
	g: number;
	power: number;
	climbing: boolean;
	hitbox: IRect;
	hitBoxOffset: IHitboxOffset;
	img: HTMLImageElement;
	stoppedImg: HTMLImageElement;
	flyImgs: HTMLImageElement[];
	smokeImg: HTMLImageElement;
	smoke: ICoord[];

	constructor(game: Game) {
		this.game = game;
		this.g = 3500;
		this.power = 6500;
		this.hitBoxOffset = { left: 10, right: 10, top: 5, bottom: 5 };
		this.loadAssets();
	}

	init() {
		this.x = this.game.width / 4;
		this.y = this.game.height / 2;
		this.xv = 700;
		this.yv = 0;
		this.width = 124;
		this.height = 57;
		this.climbing = false;
		this.smoke = [];
		this.img = this.flyImgs[0];
	}

	loadAssets() {
		this.smokeImg = loadImage("img/smoke.png");
		this.stoppedImg = loadImage("img/copter_stopped.png");
		this.flyImgs = [
			loadImage("img/copter1.png"),
			loadImage("img/copter2.png"),
			loadImage("img/copter3.png"),
			loadImage("img/copter4.png"),
			loadImage("img/copter5.png"),
			loadImage("img/copter6.png"),
			loadImage("img/copter7.png"),
			loadImage("img/copter8.png"),
			loadImage("img/copter9.png"),
			loadImage("img/copter10.png"),
			loadImage("img/copter11.png"),
			loadImage("img/copter12.png"),
			loadImage("img/copter13.png"),
			loadImage("img/copter14.png"),
			loadImage("img/copter15.png"),
			loadImage("img/copter16.png"),
			loadImage("img/copter17.png"),
			loadImage("img/copter18.png"),
			loadImage("img/copter19.png"),
			loadImage("img/copter20.png")
		];
	}

	crash() {
		this.game.endTime = now();
		this.game.distance = Math.floor((this.game.endTime - this.game.startTime) / 30);
		this.game.best = this.game.distance > this.game.best ? this.game.distance : this.game.best;
		this.game.isOver = true;
		this.game.reportScore();
	}

	update(step: number) {
		this.updateImg();

		if (this.game.pausedAtStart) return;

		this.updateSmoke(step);

		if (this.game.isOver) return;

		if (this.game.startTime === undefined) this.game.startTime = now();
		this.game.distance = Math.floor((now() - this.game.startTime) / 30);

		// update position
		this.yv += this.g * step;
		if (this.climbing) this.yv -= this.power * step;
		this.y += this.yv * step;

		// update hitbox position
		this.hitbox = {
			x: this.x + this.hitBoxOffset.left,
			y: this.y + this.hitBoxOffset.top,
			width: this.width - this.hitBoxOffset.left - this.hitBoxOffset.right,
			height: this.height - this.hitBoxOffset.top - this.hitBoxOffset.bottom
		};

		// enforce maximum vertical speeds
		if (this.yv < -500) this.yv = -500;
		if (this.yv > 650) this.yv = 650;

		// check for collision with tunnel
		for (const segment of this.game.terrain.tunnel) {
			const segmentTopRect: IRect = { x: segment.x, y: 0, width: segment.length, height: segment.topDepth };
			const segmentBotRect: IRect = { x: segment.x, y: this.game.height - segment.botDepth, width: segment.length, height: segment.botDepth };

			if (areRectanglesColliding(this.hitbox, segmentTopRect) || areRectanglesColliding(this.hitbox, segmentBotRect)) {
				this.crash();
			}
		}

		// check for collision with blocks
		for (const block of this.game.terrain.blocks) {
			if (areRectanglesColliding(this.hitbox, block)) {
				this.crash();
			}
		}
	}

	updateImg() {
		if (this.game.isOver) return this.img = this.stoppedImg;
		this.img = this.flyImgs[Math.floor(Math.random() * this.flyImgs.length)];
	}

	updateSmoke(step: number) {
		if (this.game.pausedAtStart) return;

		// add new smoke puff
		if (!this.game.isOver && (this.smoke.length === 0 || this.x - this.smoke[this.smoke.length - 1].x >= 40)) {
			this.smoke.push({ x: this.x - this.smokeImg.width + 4, y: this.y + 6 });
		}

		if (this.smoke.length < 1) return;

		// remove smoke puff if it is offscreen
		if (this.smoke[0].x < -this.smokeImg.width) {
			this.smoke.shift();
		}

		// update position
		for (const puff of this.smoke) {
			puff.x -= this.xv * step;
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.climbing && !this.game.pausedAtStart && !this.game.isOver) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(-5 * Math.PI / 180);
			ctx.drawImage(this.img, 0, 0);
			ctx.restore();
		} else {
			ctx.drawImage(this.img, this.x, this.y);
		}

		this.drawSmoke(ctx);
	}

	drawSmoke(ctx: CanvasRenderingContext2D) {
		for (const s of this.smoke) {
			ctx.drawImage(this.smokeImg, s.x, s.y);
		}
	}
}
