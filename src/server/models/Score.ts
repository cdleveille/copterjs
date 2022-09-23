import { model, Schema } from "mongoose";

import { IScore } from "@shared/types/abstract";

import { IScoreModel } from "../types/abstract";
import { BaseSchema } from "./_base";

const ScoreSchema = new Schema<IScore>({
	player: {
		type: String,
		required: true
	},
	score: {
		type: Number,
		required: true
	}
}).add(BaseSchema);

export const Score = model<IScore, IScoreModel>("Score", ScoreSchema);
