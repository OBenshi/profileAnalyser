import mongoose, { Schema, connect, Model } from "mongoose";
import { datingTextNs } from "../@types/index";

const datingTextSchema: Schema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: false, ref: "user" },
  postDate: { type: Date, required: false },
  text: { type: String, required: false },
  score: { type: Number, required: false },
  display: { type: Boolean, required: false },
  private: { type: Boolean, required: false },
  comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  toneResults: { type: Object, required: true },
});
const datingTextModel: Model<datingTextNs.datingTextSchemaData> =
  mongoose.model("datingText", datingTextSchema);
export default datingTextModel;
