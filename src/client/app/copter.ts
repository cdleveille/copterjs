import { Game } from "./game";
import { imgs } from "./img";
import { ICoord, IHitboxOffset, IRect } from "./types/abstract";
import { areRectanglesColliding, now, setHidden } from "./util";

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
	hitboxes: IRect[];
	hitboxOffsets: IHitboxOffset[];
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
		this.hitboxOffsets = [
			{
				left: 58 * this.game.scale,
				right: 33 * this.game.scale,
				top: 1 * this.game.scale,
				bottom: 54 * this.game.scale
			},
			{
				left: 42 * this.game.scale,
				right: 18 * this.game.scale,
				top: 4 * this.game.scale,
				bottom: 51 * this.game.scale
			},
			{
				left: 31 * this.game.scale,
				right: 10 * this.game.scale,
				top: 7 * this.game.scale,
				bottom: 48 * this.game.scale
			},
			{
				left: 6 * this.game.scale,
				right: 110 * this.game.scale,
				top: 10 * this.game.scale,
				bottom: 45 * this.game.scale
			},
			{
				left: 26 * this.game.scale,
				right: 5 * this.game.scale,
				top: 10 * this.game.scale,
				bottom: 45 * this.game.scale
			},
			{
				left: 2 * this.game.scale,
				right: 3 * this.game.scale,
				top: 13 * this.game.scale,
				bottom: 37 * this.game.scale
			},
			{
				left: 5 * this.game.scale,
				right: 5 * this.game.scale,
				top: 21 * this.game.scale,
				bottom: 34 * this.game.scale
			},
			{
				left: 13 * this.game.scale,
				right: 8 * this.game.scale,
				top: 24 * this.game.scale,
				bottom: 31 * this.game.scale
			},
			{
				left: 13 * this.game.scale,
				right: 15 * this.game.scale,
				top: 27 * this.game.scale,
				bottom: 28 * this.game.scale
			},
			{
				left: 60 * this.game.scale,
				right: 17 * this.game.scale,
				top: 30 * this.game.scale,
				bottom: 4 * this.game.scale
			}
		] as IHitboxOffset[];

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

		setHidden(this.game.controls);

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

		// update position of hitboxes
		this.hitboxes = [];
		for (const hitboxOffset of this.hitboxOffsets) {
			this.hitboxes.push({
				x: this.x + hitboxOffset.left,
				y: this.y + hitboxOffset.top,
				width: this.width - hitboxOffset.left - hitboxOffset.right,
				height: this.height - hitboxOffset.top - hitboxOffset.bottom
			} as IRect);
		}

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

			for (const hitbox of this.hitboxes) {
				if (areRectanglesColliding(hitbox, segmentTopRect) || areRectanglesColliding(hitbox, segmentBotRect)) {
					this.crash();
				}
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

			for (const hitbox of this.hitboxes) {
				if (areRectanglesColliding(hitbox, blockRect)) {
					this.crash();
				}
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
