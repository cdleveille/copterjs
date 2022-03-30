import Game from "./game.js";
import { ITunnel } from "./util.js";

export default class Terrain {
	game: Game;
	tunnel: ITunnel[];

	constructor(game: Game) {
		this.game = game;
	}

	init() {
		this.tunnel = [];
		this.tunnel.push({ x: 0, length: 1800, topDepth: 80, botDepth: 80 });
		this.tunnel.push({ x: 1800, length: 200, topDepth: 100, botDepth: 60 });
	}

	update(step: number) {
		if (this.game.paused) return;

		for (const segment of this.tunnel) {
			segment.x -= this.game.copter.xv * step;
		}

		if (this.tunnel.length > 0 && this.tunnel[0].x + this.tunnel[0].length < 0) {
			this.tunnel.shift();
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#65fc65";

		for (const t of this.tunnel) {
			ctx.fillRect(t.x, 0, t.length, t.topDepth);
			ctx.fillRect(t.x, this.game.height - t.botDepth, t.length, t.botDepth);
		}
	}
}
