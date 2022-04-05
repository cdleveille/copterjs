import Game from "./game.js";
import { Color } from "./types/constant.js";
import { ITunnel, IRect, } from "./types/abstract";

export default class Terrain {
	game: Game;
	tunnel: ITunnel[];
	blocks: IRect[];

	constructor(game: Game) {
		this.game = game;
		this.tunnel = [];
		this.blocks = [];
	}

	init() {
		this.tunnel = [];
		this.blocks = [];
	}

	resize() {
		this.resizeTunnel();
		this.resizeBlocks();
	}

	resizeTunnel() {
		for (let segment of this.tunnel) {
			segment.x = segment.xPct * this.game.width;
		}
	}

	resizeBlocks() {
		for (let block of this.blocks) {
			block.x = block.x * this.game.scale;
			block.y = block.y * this.game.scale;
			block.width = block.width * this.game.scale;
			block.height = block.height * this.game.scale;
		}
	}

	update(step: number) {
		if (this.game.isOver) return;

		this.updateTunnel(step);
		this.updateBlocks(step);
	}

	updateTunnel(step: number) {
		this.maintainTunnel();

		// update position of each tunnel segment, remove if offscreen
		for (const segment of this.tunnel) {
			if (!this.game.pausedAtStart) segment.x -= this.game.copter.xv * step;
			segment.xPct = segment.x / this.game.width;
			if (segment.x + (segment.lengthPct * this.game.width) < 0) this.tunnel.shift();
		}
	}

	maintainTunnel() {
		if (this.game.pausedAtStart && this.tunnel.length === 0) {
			this.createInitialTunnel();
		}
	}

	createInitialTunnel() {
		this.tunnel.push(this.newTunnelSegment(0, 999999999999999, 9, 9));
	}

	newTunnelSegment(x: number, lengthPct: number, topDepthPct: number, botDepthPct: number): ITunnel {
		return {
			x: x,
			xPct: x / this.game.width,
			lengthPct: lengthPct / 100,
			topDepthPct: topDepthPct / 100,
			botDepthPct: botDepthPct / 100
		} as ITunnel;
	}

	updateBlocks(step: number) {
		// update position of each block, remove if offscreen
		for (const block of this.blocks) {
			block.x -= this.game.copter.xv * step;
			if (block.x + block.width < 0) this.blocks.shift();
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = Color.green;

		// draw tunnel
		for (const segment of this.tunnel) {
			ctx.fillRect(segment.x, 0, (segment.lengthPct * this.game.width), segment.topDepthPct * this.game.height);
			ctx.fillRect(segment.x, this.game.height - (segment.botDepthPct * this.game.height), (segment.lengthPct * this.game.width), segment.botDepthPct * this.game.height);
		}

		// draw blocks
		for (const block of this.blocks) {
			ctx.fillRect(block.x, block.y, block.width, block.height);
		}
	}
}
