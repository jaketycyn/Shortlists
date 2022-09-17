import mongoose from "mongoose";
import UserCustomListItem from "../models/UserCustomListItem.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
} from "../errors/index.js";
import UserCustomList from "../models/UserCustomList.js";

const addItem = async (req, res) => {
  const { itemTitle, parentListId, insideList, userSelection, creatorId } =
    req.body;
  // console.log("req.body");
  // console.log(req.body);
  // console.log(itemTitle);
  console.log(userSelection);

  // console.log("insideList: " + insideList);
  // console.log("userId: " + userId);
  //console.log("creatorId: " + creatorId);
  console.log("userSelection: " + userSelection);
  console.log(JSON.stringify(userSelection));
  // res.send("addItem");

  if (!itemTitle) {
    throw new BadRequestError("Please provide a name for your item");
  }

  // All properties for item on creation listed below
  // req.body.ranking = 0;
  // req.body.potentialRanking = 0;
  // req.body.botBound = 0;
  // req.body.topBound = 0;

  if (insideList === "created") {
    req.body.createdById = req.user.userId;
    req.body.ownerId = req.user.userId;
    req.body.parentListId = parentListId;
    req.body.selection = userSelection;
    const userItem = await UserCustomListItem.create(req.body);
    res.status(StatusCodes.CREATED).json({ userItem });
  }

  if (insideList === "received") {
    //slight change in logic of owner vs creator compared to prototype 1.0.
    //! owner will be the original creator of a list.
    //! for items the person who writes into the input and submits is the creator however, the owner will be the original sender of the social list. Hopefully will find better variable names in the future to prevent any potential difficulties
    req.body.createdById = req.user.userId;
    req.body.ownerId = creatorId;
    req.body.parentListId = parentListId;
    const userItem = await UserCustomListItem.create(req.body);

    res.status(StatusCodes.CREATED).json({ userItem });
    console.log("SOMEONE ELSES lets create an item");
  }
};

const addSentItems = async (req, res) => {
  const { sentListId, itemsToCopy, friendIdentifier, userSelection } = req.body;
  console.log("req.body");
  console.log(req.body);
  console.log("req.body.sentListId");
  console.log(req.body.sentListId);
  console.log("req.body.itemsToCopy");
  console.log(req.body.itemsToCopy);
  console.log(req.body.userSelection);
  console.log("req.body.userSelection");

  const sentItems = req.body.itemsToCopy;
  console.log("sentItems");
  console.log(sentItems);

  sentItems.forEach(
    (item) =>
      (item.ownerId = friendIdentifier) && (item.parentListId = sentListId)
  );
  // console.log("sentItems");
  // console.log(sentItems);
  sentItems.forEach((item) => delete item._id);
  // console.log("sentItems");
  // console.log(sentItems);

  const sentUserItems = await UserCustomListItem.insertMany(sentItems);

  res.status(StatusCodes.CREATED).json({ sentUserItems });
};

const getAllItems = async (req, res) => {
  //const { parentListId } = req.params;
  const { userListIds } = req.params;

  // testing console logs
  // console.log("req.params");
  // console.log(req.params);

  // console.log("userListIds");
  // console.log(userListIds);
  //taking giant string of ids and creating array
  if (userListIds) {
    const newUserListIds = userListIds.split(",");

    //console.log("newUserListIds");
    //console.log(newUserListIds);
    const allUserItems = await UserCustomListItem.find({
      parentListId: { $in: newUserListIds },
    });

    //console.log("allUserItems " + allUserItems);

    res.status(StatusCodes.OK).json({
      allUserItems,
    });
  }

  // console.log("req.user");
  // console.log(req.user);
  // console.log("parentListId");
  // console.log(parentListId);

  //finding all items belong to user. Couldn't not figure out how a multi query works.
  //TODO RF: multi variable/property query to mongoDB. To find specific items from the list requested. And not all.\
  //! old item lookup/get
  // const userOwnedItems = await UserCustomListItem.find({
  //   ownerId: req.user.userId,
  // });

  // const userCreatedItems = await await UserCustomListItem.find({
  //   createdById: req.user.userId,
  //   ownedId: !req.user.userId,
  // });

  //!I need every list id the user is a contributor in.

  // res.status(StatusCodes.OK).json({
  //   userOwnedItems,
  //   userCreatedItems,
  //   totalUserCreatedItems: userCreatedItems.length,
  // });

  console.log("getAllItems");
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  const item = await UserCustomListItem.findOne({ _id: itemId });

  // console.log("req.params");
  // console.log(req.params);
  // console.log("item: " + item);

  if (!item) {
    throw new NotFoundError(`No item with id: ${itemId}`);
  }

  if (item) {
    await item.remove();

    await res.status(StatusCodes.OK).json({ msg: "Success! Item Removed" });
  }

  // res.send("deleteList");
};

const updateItem = async (req, res) => {
  console.log("updateItem");
  res.send("updateItem");
};

export { addItem, addSentItems, getAllItems, deleteItem, updateItem };
