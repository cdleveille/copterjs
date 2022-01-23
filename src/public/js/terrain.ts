import Game from "./game.js";
import { ITunnel } from "./util.js";

export default class Terrain {
	game: Game;
	tunnel: ITunnel[];

	constructor(game: Game) {
		this.game = game;
		this.tunnel = [];
	}

	init() {
		this.tunnel.push({ x: 0, length: 999999999999999, topDepth: 80, botDepth: 80 });
	}

	update(step: number) {
		if (this.game.paused) return;

		for (const t of this.tunnel) {
			t.x -= this.game.copter.xv * step;
		}

		if (this.tunnel[0].x + this.tunnel[0].length < 0) {
			this.tunnel.shift();
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#65fc65";

		for (const t of this.tunnel) {
			ctx.fillRect(t.x, 0, t.length, t.topDepth);
			ctx.fillRect(t.x, window.innerHeight - t.botDepth, t.length, t.botDepth);
		}
	}
}
