import Game from "./game.js";
import { ICoord, loadImage } from "./util.js";

export default class Copter {
	game: Game;
	x: number;
	y: number;
	xv: number;
	yv: number;
	g: number;
	power: number;
	climbing: boolean;
	img: HTMLImageElement;
	smokeImg: HTMLImageElement;
	smoke: ICoord[];

	constructor(game: Game) {
		this.game = game;
		this.g = 4000;
		this.power = 7500;
		this.loadAssets();
	}

	init() {
		this.x = window.innerWidth / 4;
		this.y = window.innerHeight / 2;
		this.xv = 500;
		this.yv = 0;
		this.climbing = false;
		this.smoke = [];
	}

	loadAssets() {
		this.img = loadImage("/img/copter.png");
		this.smokeImg = loadImage("/img/smoke.png");
	}

	update(step: number) {
		if (this.game.paused) return;

		this.yv += this.g * step;
		if (this.climbing) this.yv -= this.power * step;
		this.y += this.yv * step;

		if (this.y < 0) {
			this.y = 0;
			this.yv = 0;
		}
		if (this.y > window.innerHeight - this.img.height) {
			this.y = window.innerHeight - this.img.height;
			this.yv = 0;
		}

		if (this.yv < -600) this.yv = -600;
		if (this.yv > 800) this.yv = 800;

		if (this.smoke.length === 0 || this.x - this.smoke[this.smoke.length - 1].x >= 40) {
			this.smoke.push({ x: this.x - this.smokeImg.width + 4, y: this.y + 6 });
		}

		if (this.smoke[0].x < -this.smokeImg.width) {
			this.smoke.shift();
		}

		for (const s of this.smoke) {
			s.x -= this.xv * step;
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (this.climbing) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(-5 * Math.PI / 180);
			ctx.drawImage(this.img, 0, 0);
			ctx.restore();
		} else {
			ctx.drawImage(this.img, this.x, this.y);
		}

		for (const s of this.smoke) {
			ctx.drawImage(this.smokeImg, s.x, s.y);
		}
	}
}
