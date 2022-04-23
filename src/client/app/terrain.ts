import { Game } from "./game";
import { IBlock, ITunnel } from "./types/abstract";
import { Color } from "./types/constant";
import { now, randomInt } from "./util";

export class Terrain {
	game: Game;
	tunnel: ITunnel[];
	blocks: IBlock[];
	newBlockNeeded: boolean;

	constructor(game: Game) {
		this.game = game;
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
		if (!this.tunnel) return;
		for (const segment of this.tunnel) {
			segment.x = segment.xPct * this.game.width;
		}
	}

	resizeBlocks() {
		if (!this.blocks) return;
		for (const block of this.blocks) {
			block.x = block.xPct * this.game.width;
			block.y = block.yPct * this.game.height;
		}
	}

	updateTunnel(delta: number) {
		this.maintainTunnel();

		// update position of each tunnel segment, remove if offscreen
		for (const segment of this.tunnel) {
			if (!this.game.pausedAtStart) segment.x -= this.game.copter.xv * delta;
			segment.xPct = segment.x / this.game.width;
			if (segment.x + segment.lengthPct * this.game.width < 0) this.tunnel.shift();
		}
	}

	maintainTunnel() {
		if (this.game.pausedAtStart && this.tunnel.length === 0) this.createInitialTunnelSegment();

		// if last tunnel segment is on the game screen, generate another
		const lastSegment = this.tunnel[this.tunnel.length - 1];
		if (lastSegment.x < this.game.width) {
			this.createNewTunnelSegment(lastSegment);
		}
	}

	createInitialTunnelSegment() {
		this.tunnel.push(this.newTunnelSegment(0, 110, 9, 9));
	}

	createNewTunnelSegment(lastSegment: ITunnel) {
		let maxTunnelWidthPct: number, minTunnelWidthPct: number;
		const minEdgeDepthPct = 9;

		const secondsPerStage = 15;
		const seconds = (now() - this.game.startTime) / 1000;

		// at 0s
		if (seconds < secondsPerStage) {
			maxTunnelWidthPct = 80;
			minTunnelWidthPct = 70;
			// at 15s
		} else if (seconds < secondsPerStage * 2) {
			maxTunnelWidthPct = 75;
			minTunnelWidthPct = 65;
			// at 30s
		} else if (seconds < secondsPerStage * 3) {
			maxTunnelWidthPct = 60;
			minTunnelWidthPct = 50;
			// at 45s
		} else if (seconds < secondsPerStage * 4) {
			maxTunnelWidthPct = 55;
			minTunnelWidthPct = 45;
			// at 60s
		} else if (seconds < secondsPerStage * 6) {
			maxTunnelWidthPct = 50;
			minTunnelWidthPct = 40;
			// at 90s
		} else {
			maxTunnelWidthPct = 45;
			minTunnelWidthPct = 37;
		}

		const x = lastSegment.x + lastSegment.lengthPct * this.game.width;
		const topDirection = randomInt(0, 3);
		const botDirection = randomInt(0, 3);
		const lengthPct = randomInt(5, 15);

		let topDepthPct: number, botDepthPct: number;

		switch (topDirection) {
			case 0:
				topDepthPct = lastSegment.topDepthPct * 100 + 1;
				break;
			case 1:
				topDepthPct = lastSegment.topDepthPct * 100;
				break;
			case 2:
				topDepthPct = lastSegment.topDepthPct * 100 - 1;
				break;
		}

		switch (botDirection) {
			case 0:
				botDepthPct = lastSegment.botDepthPct * 100 + 1;
				break;
			case 1:
				botDepthPct = lastSegment.botDepthPct * 100;
				break;
			case 2:
				botDepthPct = lastSegment.botDepthPct * 100 - 1;
				break;
		}

		// ensure tunnel does not go out of bounds
		if (topDepthPct < minEdgeDepthPct) topDepthPct = minEdgeDepthPct;
		if (botDepthPct < minEdgeDepthPct) botDepthPct = minEdgeDepthPct;

		const segmentWidthPct = 100 - topDepthPct - botDepthPct;
		if (segmentWidthPct < minTunnelWidthPct) {
			const side = randomInt(0, 2);
			switch (side) {
				case 0:
					botDepthPct -= 1;
					break;
				case 1:
					topDepthPct -= 1;
					break;
			}
		} else if (segmentWidthPct > maxTunnelWidthPct) {
			const side = randomInt(0, 2);
			switch (side) {
				case 0:
					botDepthPct += 1;
					break;
				case 1:
					topDepthPct += 1;
					break;
			}
		}

		if (this.newBlockNeeded) this.createNewBlock(x, topDepthPct, botDepthPct);

		this.tunnel.push(this.newTunnelSegment(x, lengthPct, topDepthPct, botDepthPct));
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

	updateBlocks(delta: number) {
		this.maintainBlocks();

		// update position of each block, remove if offscreen
		for (const block of this.blocks) {
			if (!this.game.pausedAtStart) block.x -= this.game.copter.xv * delta;
			block.xPct = block.x / this.game.width;
			block.yPct = block.y / this.game.height;
			if (block.x + block.widthPct * this.game.width < 0) this.blocks.shift();
		}
	}

	maintainBlocks() {
		// if last block has gone off the game screen or there are no blocks, generate another
		if (
			this.blocks.length === 0 ||
			this.blocks[this.blocks.length - 1].x + this.blocks[this.blocks.length - 1].xPct * this.game.width < 0
		) {
			this.newBlockNeeded = true;
		}
	}

	createNewBlock(x: number, topDepthPct: number, botDepthPct: number) {
		const widthPct = 3;
		const heightPct = 18;

		const yMin = Math.floor((topDepthPct / 100 + 0.01) * this.game.height);
		const yMax = Math.floor(
			this.game.height - (botDepthPct / 100 + 0.01) * this.game.height - (heightPct / 100) * this.game.height
		);

		const y = randomInt(yMin, yMax + 1);
		this.blocks.push(this.newBlock(x, y, widthPct, heightPct));
		this.newBlockNeeded = false;
	}

	newBlock(x: number, y: number, widthPct: number, heightPct: number): IBlock {
		return {
			x,
			y,
			xPct: x / this.game.width,
			yPct: y / this.game.height,
			widthPct: widthPct / 100,
			heightPct: heightPct / 100
		} as IBlock;
	}

	update(delta: number) {
		if (this.game.isOver) return;

		this.updateTunnel(delta);
		this.updateBlocks(delta);
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = Color.green;

		// draw tunnel
		for (const segment of this.tunnel) {
			ctx.fillRect(
				Math.floor(segment.x),
				0,
				Math.floor(segment.lengthPct * this.game.width) + 1,
				Math.floor(segment.topDepthPct * this.game.height)
			);
			ctx.fillRect(
				Math.floor(segment.x),
				Math.floor(this.game.height - segment.botDepthPct * this.game.height) + 1,
				Math.floor(segment.lengthPct * this.game.width) + 1,
				Math.floor(segment.botDepthPct * this.game.height) + 1
			);
		}

		// draw blocks
		for (const block of this.blocks) {
			ctx.fillRect(block.x, block.y, block.widthPct * this.game.width, block.heightPct * this.game.height);
		}
	}
}
