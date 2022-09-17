import { kMaxLength } from "buffer";
import mongoose from "mongoose";
import { userInfo } from "os";

const UserCustomListItemSchema = new mongoose.Schema(
  {
    itemTitle: {
      type: String,
      required: [true, "Please provide list name"],
      maxlength: 50,
    },
    createdById: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    parentListId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide a parentListId"],
      maxlength: 50,
    },
    selection: {
      type: Array,
      default: [],
    },
    //come back later to do ranking stuff
    ranking: {
      type: Number,
    },
    potentialRanking: {
      type: Number,
    },
    botBound: {
      type: Number,
    },
    topBound: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserCustomListItem", UserCustomListItemSchema);
