import Game from "./game.js";
import { ITunnel } from "./util.js";
import { IRect } from "./util";

export default class Terrain {
	game: Game;
	tunnel: ITunnel[];
	blocks: IRect[];

	constructor(game: Game) {
		this.game = game;
	}

	init() {
		this.tunnel = [];
		this.tunnel.push({ x: 0, length: 2000, topDepth: 80, botDepth: 80 });
		this.tunnel.push({ x: 1999, length: 500, topDepth: 100, botDepth: 100 });
		this.tunnel.push({ x: 2498, length: 500, topDepth: 120, botDepth: 120 });
		this.tunnel.push({ x: 2997, length: 500, topDepth: 140, botDepth: 140 });
		this.tunnel.push({ x: 3496, length: 500, topDepth: 120, botDepth: 120 });
		this.tunnel.push({ x: 3995, length: 500, topDepth: 100, botDepth: 100 });
		this.tunnel.push({ x: 4494, length: 999999999999999, topDepth: 80, botDepth: 80 });

		this.blocks = [];
		this.blocks.push({ x: 1500, y: 300, width: 50, height: 150 });
	}

	update(step: number) {
		if (this.game.paused || this.game.isOver) return;

		this.updateTunnel(step);
		this.updateBlocks(step);
	}

	updateTunnel(step: number) {
		// update position of each tunnel segment, remove if offscreen
		for (const segment of this.tunnel) {
			segment.x -= this.game.copter.xv * step;
			if (segment.x + segment.length < 0) this.tunnel.shift();
		}
	}

	updateBlocks(step: number) {
		// update position of each block, remove if offscreen
		for (const block of this.blocks) {
			block.x -= this.game.copter.xv * step;
			if (block.x + block.width < 0) this.blocks.shift();
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#65fc65";

		// draw tunnel
		for (const segment of this.tunnel) {
			ctx.fillRect(segment.x, 0, segment.length, segment.topDepth);
			ctx.fillRect(segment.x, this.game.height - segment.botDepth, segment.length, segment.botDepth);
		}

		// draw blocks
		for (const block of this.blocks) {
			ctx.fillRect(block.x, block.y, block.width, block.height);
		}
	}
}
