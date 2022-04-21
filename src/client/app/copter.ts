import { Game } from "./game";
import { imgs } from "./img";
import { ICoord, IHitboxOffset, IRect } from "./types/abstract";
import { areRectanglesColliding, now } from "./util";

export class Copter {
	game: Game;
	x: number;
	y: number;
	yPct: number;
	width: number;
	height: number;
	xv: number;
	yv: number;
	yvMin: number;
	yvMax: number;
	g: number;
	power: number;
	climbing: boolean;
	hitbox: IRect;
	hitBoxOffset: IHitboxOffset;
	img: HTMLImageElement;
	smoke: ICoord[];

	constructor(game: Game) {
		this.game = game;
		this.yvMin = -500;
		this.yvMax = 670;
	}

	init() {
		this.x = this.game.width / 4;
		this.y = this.game.height / 2 - this.height / 2;
		this.yPct = this.y / this.game.height;
		this.yv = 0;
		this.climbing = false;
		this.smoke = [];
		this.img = imgs.flyImgs[0].img;
	}

	crash() {
		this.game.endTime = now();
		if (!navigator.onLine) this.game.updateDistance(Math.floor((this.game.endTime - this.game.startTime) / 30));
		this.game.isOver = true;
		this.game.endRun(this.game.distance);
	}

	resize() {
		// constant
		this.g = 3600 * this.game.scale;
		this.power = 6500 * this.game.scale;
		this.xv = 900 * this.game.scale;
		this.width = 124 * this.game.scale;
		this.height = 57 * this.game.scale;
		this.hitBoxOffset = {
			left: 10 * this.game.scale,
			right: 10 * this.game.scale,
			top: 5 * this.game.scale,
			bottom: 5 * this.game.scale
		};

		// variable
		this.x = this.game.width / 4;
		this.y = this.yPct * this.game.height;
		this.yv = this.yv * this.game.scale;
	}

	updateImg() {
		if (this.game.isOver) return (this.img = imgs.copterStopped.img);
		this.img = imgs.flyImgs[Math.floor(Math.random() * imgs.flyImgs.length)].img;
	}

	updateSmoke(delta: number) {
		if (this.game.pausedAtStart) return;

		// add new smoke puff
		if (
			!this.game.isOver &&
			(this.smoke.length === 0 || this.x - this.smoke[this.smoke.length - 1].x >= 50 * this.game.scale)
		) {
			this.smoke.push({ x: this.x - 18 * this.game.scale, y: this.y + 6 * this.game.scale });
		}

		if (this.smoke.length < 1) return;

		// remove smoke puff if it is offscreen
		if (this.smoke[0].x < -imgs.smoke.img.width) {
			this.smoke.shift();
		}

		// update position
		for (const puff of this.smoke) {
			puff.x -= this.xv * delta;
		}
	}

	update(delta: number) {
		this.updateImg();

		this.yPct = this.y / this.game.height;

		if (this.game.pausedAtStart) return;

		this.updateSmoke(delta);

		if (this.game.isOver) return;

		if (this.game.startTime === undefined) {
			this.game.startTime = now();
			if (!this.game.noDB && navigator.onLine) this.game.socket.emit("start-run");
		}
		this.game.distance = Math.floor((now() - this.game.startTime) / 30);

		// update position
		this.yv += this.g * delta;
		if (this.climbing) this.yv -= this.power * delta;
		this.y += this.yv * delta;

		// update hitbox position
		this.hitbox = {
			x: this.x + this.hitBoxOffset.left,
			y: this.y + this.hitBoxOffset.top,
			width: this.width - this.hitBoxOffset.left - this.hitBoxOffset.right,
			height: this.height - this.hitBoxOffset.top - this.hitBoxOffset.bottom
		};

		// enforce maximum vertical speeds
		if (this.yv < this.yvMin * this.game.scale) this.yv = this.yvMin * this.game.scale;
		if (this.yv > this.yvMax * this.game.scale) this.yv = this.yvMax * this.game.scale;

		// check for collision with tunnel
		for (const segment of this.game.terrain.tunnel) {
			const segmentTopRect: IRect = {
				x: segment.x,
				y: 0,
				width: segment.lengthPct * this.game.width,
				height: segment.topDepthPct * this.game.height
			};

			const segmentBotRect: IRect = {
				x: segment.x,
				y: this.game.height - segment.botDepthPct * this.game.height,
				width: segment.lengthPct * this.game.width,
				height: segment.botDepthPct * this.game.height
			};

			if (
				areRectanglesColliding(this.hitbox, segmentTopRect) ||
				areRectanglesColliding(this.hitbox, segmentBotRect)
			) {
				this.crash();
			}
		}

		// check for collision with blocks
		for (const block of this.game.terrain.blocks) {
			const blockRect: IRect = {
				x: block.x,
				y: block.y,
				width: block.widthPct * this.game.width,
				height: block.heightPct * this.game.height
			};

			if (areRectanglesColliding(this.hitbox, blockRect)) {
				this.crash();
			}
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		const noseAngleMagnitute = 8;
		let noseAngle: number;
		if (this.yv < 0) {
			noseAngle = Math.min(-noseAngleMagnitute * (this.yv / (this.yvMin * this.game.scale)), 0);
		} else {
			noseAngle = Math.max(-noseAngleMagnitute * (this.yv / (this.yvMax * this.game.scale)), 0);
		}

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate((noseAngle * Math.PI) / 180);
		ctx.drawImage(this.img, 0, 0, 124 * this.game.scale, 57 * this.game.scale);
		ctx.restore();

		for (const s of this.smoke) {
			ctx.drawImage(imgs.smoke.img, s.x, s.y, 19 * this.game.scale, 23 * this.game.scale);
		}
	}
}
