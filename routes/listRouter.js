import express from "express";
const listRouter = express.Router();

import {
  addItem,
  addSentItems,
  getAllItems,
  deleteItem,
  updateItem,
} from "../controllers/listController.js";

listRouter.route("/").post(addItem);
listRouter.route("/listIds/:userListIds").get(getAllItems);
listRouter.route("/copy").post(addSentItems);
//remember about :id
//removed showItemInfo for now can add later if need be
// listRouter.route("/info").get(showItemInfo);
listRouter.route("/:itemId").delete(deleteItem).patch(updateItem);

export default listRouter;
