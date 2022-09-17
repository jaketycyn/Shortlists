import express from "express";
const userlistsRouter = express.Router();

import {
  getAllLists,
  createList,
  createSentList,
  createSocialList,
  getSentListId,
  updateList,
  AddContributorsToList,
  deleteList,
  showListInfo,
} from "../controllers/userlistController.js";

userlistsRouter.route("/").post(createList).get(getAllLists);
//remember about :id
userlistsRouter.route("/info").get(showListInfo);
userlistsRouter.route("/:listId").delete(deleteList).patch(updateList);
userlistsRouter.route("/:listTitle/").post(createSocialList);
//using listTitle down below for post(createSocialList) since its creating only 1 list and the ID will be auto created. For updates I'll have to pass an ID instead
userlistsRouter
  .route("/:listTitle/:friendIdentifier")
  // .post(createSocialList)
  .patch(AddContributorsToList);
userlistsRouter.route("/createSentList").post(createSentList);
userlistsRouter
  .route("/createSentList/:friendIdentifier/:listCreatorId/:sentListTitle")
  .get(getSentListId);

export default userlistsRouter;
