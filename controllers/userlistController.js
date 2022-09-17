import UserCustomList from "../models/UserCustomList.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
} from "../errors/index.js";

const createList = async (req, res) => {
  const { listTitle } = req.body;

  console.log("req.body");
  console.log(req.body);

  if (!listTitle) {
    throw new BadRequestError("Please provide a title for your list");
  }
  const currentUser = req.user.userId;
  const listObj = {};
  listObj.listTitle = listTitle;
  listObj.createdById = currentUser;
  listObj.ownerId = currentUser;
  listObj.contributors = currentUser;
  console.log("listObj: " + listObj);
  console.log("listObjownerId: " + listObj.ownerId);

  const userList = await UserCustomList.create(listObj);

  res.status(StatusCodes.CREATED).json({ userList });
};

const createSocialList = async (req, res) => {
  const { listTitle } = req.params;
  const { friendIdentifier } = req.body;
  friendIdentifier;
  // console.log("Inside createSocialList");
  // console.log("req.params");
  // console.log(req.params);
  // console.log("req.body");
  // console.log(req.body);
  if (!listTitle) {
    throw new BadRequestError("Please provide a title for your list");
  }
  const currentUser = req.user.userId;

  const listObj = {};
  listObj.listTitle = listTitle;
  listObj.createdById = currentUser;
  listObj.ownerId = currentUser;
  //TODO: will need to change friendIdentifier to a bigger encompassing array when multiple users can be sent lists in the future
  listObj.contributors = [currentUser, friendIdentifier];
  console.log("listObjownerId: " + listObj.ownerId);
  console.log("listObj.contributors: " + listObj.contributors);
  const userList = await UserCustomList.create(listObj);
  res.status(StatusCodes.CREATED).json({ userList });
  res.send("socialist list creation");
};

const getAllLists = async (req, res) => {
  const userContributorList = await UserCustomList.find({
    contributors: req.user.userId,
  });

  // console.log("userContributorList");
  // console.log(userContributorList);
  //numOfPages hard coded to 1 for now but can make dynamic to allow flipping through multiple pages of lists later instead of infinite scrolling
  res.status(StatusCodes.OK).json({
    userContributorList,
    numOfPages: 1,
  });
};

const updateList = async (req, res) => {
  res.send("updating list test");
};

const AddContributorsToList = async (req, res) => {
  const { listId } = req.params;

  const list = await UserCustomList.findOne({ _id: listId });

  console.log("req.params");
  console.log(req.params);
  console.log("list" + list);

  if (!list) {
    throw new NotFoundError(`No list with id: ${listId}`);
  }

  //await res.status(StatusCodes.OK).json({ msg: "Success! List Removed" });

  res.send("AddContributorsToList list test");
};

const deleteList = async (req, res) => {
  const { listId } = req.params;

  const list = await UserCustomList.findOne({ _id: listId });

  console.log("req.params");
  console.log(req.params);
  console.log("list" + list);

  if (!list) {
    throw new NotFoundError(`No list with id: ${listId}`);
  }

  await list.remove();

  //await res.status(StatusCodes.OK).json({ msg: "Success! List Removed" });

  res.send("deleteList");
};

const createSentList = async (req, res) => {
  console.log("createSentList");
  //res.send("createSentList");
  const { sentListTitle, listCreatorId, friendIdentifier } = req.body;

  console.log("req.body");
  console.log(req.body);
  console.log("sentListTitle " + sentListTitle);
  console.log("friendIdentifier " + friendIdentifier);

  if (!friendIdentifier) {
    throw new BadRequestError("Please provide an active user");
  }

  req.body.listTitle = sentListTitle;
  req.body.createdById = listCreatorId;
  req.body.ownerId = friendIdentifier;

  const sentListObj = {};
  sentListObj.listTitle = sentListTitle;
  sentListObj.createdById = listCreatorId;
  sentListObj.ownerId = friendIdentifier;
  console.log("sentListObj: " + sentListObj);

  const returnData = await UserCustomList.create(sentListObj);
  res.status(StatusCodes.CREATED).json(returnData);
};

const getSentListId = async (req, res) => {
  // params we have access too:
  // friendIdentifier,
  // listCreatorId,
  // sentListTitle,

  // console.log("req.params.friendIdentifier " + req.params.friendIdentifier);
  // console.log(req.params);

  const sentListId = await UserCustomList.findOne({
    createdById: req.params.listCreatorId,
    ownerId: req.params.friendIdentifier,
    listTitle: req.params.sentListTitle,
  });

  if (sentListId === null) {
    console.log("no list with those parameters found");

    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "no list with those parameters found",
    });
  }
  if (sentListId !== null) {
    console.log("sentListId: ");
    console.log(sentListId);
    // res.send({ sentListId });

    res.status(StatusCodes.OK).json(sentListId);
  }
};

const showListInfo = async (req, res) => {
  res.send("showListInfo");
};

export {
  getAllLists,
  createList,
  createSocialList,
  createSentList,
  getSentListId,
  updateList,
  AddContributorsToList,
  deleteList,
  showListInfo,
};
