import { Entity, Property, Index } from "@mikro-orm/core";

import { Base } from "./Base.js";

@Entity()
export class Score extends Base {
	constructor(score?: Partial<Score>) {
		super();
		Object.assign(this, score);
	}

	@Index()
	@Property()
	player: string;

	@Index()
	@Property()
	score: number;
}
