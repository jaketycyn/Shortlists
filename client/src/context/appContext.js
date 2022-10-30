import React, { useReducer, useContext } from "react";
import {
  CLEAR_ALERT,
  CLEAR_VALUES,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  LOGOUT_USER,
  HANDLE_CHANGE,
  //USER
  CREATE_USER_LIST_BEGIN,
  CREATE_USER_LIST_SUCCESS,
  CREATE_USER_LIST_ERROR,
  GET_USER_LIST_BEGIN,
  GET_USER_LIST_SUCCESS,
  DELETE_USER_LIST_BEGIN,
  DELETE_USER_LIST_SUCCESS,
  SET_ACTIVE_LIST,
  SET_INSIDE_LIST,
  SET_CURRENT_USER_LIST_ITEMS,
  //USER ITEMS
  SET_ADD_ITEM_OR_LIST,
  SET_DELETE_ITEM_ID,
  CREATE_USER_LIST_ITEM_BEGIN,
  CREATE_USER_LIST_ITEM_SUCCESS,
  CREATE_USER_LIST_ITEM_ERROR,
  GET_USER_LIST_ITEM_BEGIN,
  GET_USER_LIST_ITEM_SUCCESS,
  DELETE_USER_LIST_ITEM_SUCCESS,
} from "./actions";
import reducer from "./reducer";
import axios from "axios";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  //login/register initial state
  isLoading: false,
  alertText: "",
  alertType: "",
  showAlert: false,
  friendTitle: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  //not currently using
  userLocation: "",
  //userList initial state -- using user as a prefix to denote full user controlled/created elements in case of separation or adding in lists belonging to outside entities. EX: Friend's movie list or curated list from a magazine/publication
  activeList: [],
  allUserItems: [],
  addItemOrList: false,
  currentUserListItems: [],
  deleteItemId: "",
  editListId: "",
  insideList: "",
  isEditing: false,
  itemTitle: "",
  listTitle: "",
  totalUserCreatedItems: 0,
  userContributorList: [],
  userCreatedItems: [],
  userOwnedItems: [],
};

const AppContext = React.createContext();

// TODO: pass in environment variables
// const SERVER_HOST = process.env.SERVER_HOST

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // request

  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      console.log(error);
      if (error.response.status === 401) {
        console.log("AUTH ERROR");
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);
      console.log("data: " + data);

      const { user, token } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, alertText },
      });
      addUserToLocalStorage({ user, token });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();

    //added clear values here due to isLoading to be marked True on UserSetup Success.... Might be a better spot to put it but currently, no issues. 3/18
    clearValues();
  };

  //UPDATE USER SECTION

  // const updateUser = async ({ currentUser, endpoint }) => {
  //   dispatch({ type: UPDATE_USER_BEGIN });
  //   try {
  //     const { data } = await authFetch.patch(`/auth/${endPoint}`, currentUser);
  //     console.log("data: " + data);

  //     const { user, token } = data;
  //     dispatch({
  //       type: SETUP_USER_SUCCESS,
  //       payload: { user, token, alertText },
  //     });
  //     addUserToLocalStorage({ user, token });
  //   } catch (error) {
  //     dispatch({
  //       type: SETUP_USER_ERROR,
  //       payload: { msg: error.response.data.msg },
  //     });
  //   }
  //   clearAlert();

  //   //added clear values here due to isLoading to be marked True on UserSetup Success.... Might be a better spot to put it but currently, no issues. 3/18
  //   clearValues();
  // };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  // USER LIST

  const createUserList = async () => {
    dispatch({ type: CREATE_USER_LIST_BEGIN });
    try {
      const { listTitle } = state;
      // console.log("listTitle inside APP CONTEXT: ");
      // console.log(listTitle);
      await authFetch.post("/userlists", { listTitle });

      dispatch({ type: CREATE_USER_LIST_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      // if (error.response) {
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      //   console.log(error.response.data);
      // } else if (error.request) {
      //   //The request was made but no response was received
      //   console.log(error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log("Error Message", error.message);
      //   console.log("Error", error);
      // }
    }
  };

  //!Social List = Prompt
  const createUserSocialList = async () => {
    dispatch({ type: CREATE_USER_LIST_BEGIN });
    const { friendTitle, listTitle } = state;
    const userIdentifier = friendTitle;

    try {
      const { data } = await authFetch.get(`/auth/finduser/${userIdentifier}`);
      const friendIdentifier = data.foundUser._id;
      console.log("friendIdentifier " + friendIdentifier);
      console.log(friendIdentifier);

      await authFetch.post(`/userlists/${listTitle}/`, { friendIdentifier });
      dispatch({ type: CREATE_USER_LIST_SUCCESS });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_USER_LIST_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  //?Example of sendlIst to friend that i'll use for baseline of createUserSocialList
  // const sendListToFriend = async () => {
  //   const { activeList, friendTitle, userCreatedItems } = state;
  //   const sentListTitle = activeList[0].listTitle;
  //   const activeListId = activeList[0]._id;
  //   const listCreatorId = activeList[0].createdById;
  //   console.log("activeListId: " + activeListId);
  //   try {
  //     //TODO: can make userIdentifier the global state tracker in future
  //     const userIdentifier = friendTitle;
  //     console.log("userIdentifier " + userIdentifier);
  //     //dispatch({ type: GET_USER_ID})

  //     //!FIND USER
  //     const { data } = await authFetch.get(`/auth/finduser/${userIdentifier}`);
  //     const friendIdentifier = data.foundUser._id;

  //     console.log("friendIdentifier " + friendIdentifier);
  //     console.log(friendIdentifier);

  //     //!CREATE COPY LIST
  //     await authFetch.post("/userlists/createSentList", {
  //       friendIdentifier,
  //       listCreatorId,
  //       sentListTitle,
  //     });

  //     //!GET COPY LIST ID
  //     const returnData = await authFetch.get(
  //       `/userlists/createSentList/${friendIdentifier}/${listCreatorId}/${sentListTitle}`
  //     );
  //     console.log(returnData.data._id);

  //     const sentListId = returnData.data._id;
  //     console.log("sentListId: " + sentListId);

  //     console.log("activeListId: " + activeListId);
  //     //!CREATE ITEMS FOR COPY LIST

  //     // might swap parentListId to ownerLIstId to allow users in the future to share lists that they didnt' create but were shared to them.
  //     console.log("userCreatedItems: " + userCreatedItems);
  //     const itemsToCopy = userCreatedItems.filter(
  //       (item) => item.parentListId === activeListId
  //     );
  //     console.log("itemsToCopy");
  //     console.log(itemsToCopy);
  //     await authFetch.post("/useritems/copy", {
  //       sentListId,
  //       itemsToCopy,
  //       friendIdentifier,
  //     });
  //     clearValues();
  //   } catch (error) {
  //     console.log(error.response);
  //     console.log("error fired");
  //   }
  // };

  const getUserCreatedLists = async () => {
    let url = "/userlists";

    dispatch({ type: GET_USER_LIST_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { userContributorList, numOfPages } = data;
      dispatch({
        type: GET_USER_LIST_SUCCESS,
        payload: {
          userContributorList,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
      //logoutUser()
    }
    clearAlert();
  };

  //dont know what set is for yet
  const setEditUserCreatedList = (id) => {
    console.log(`set edit list: ${id}`);
  };

  const deleteUserCreatedList = async (listId) => {
    console.log("listId");
    console.log(listId);
    dispatch({ type: DELETE_USER_LIST_BEGIN });
    try {
      await authFetch.delete(`/userlists/${listId}`);
      //console.log("delete userlist should fire from here");
      dispatch({ type: DELETE_USER_LIST_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
      //await getUserCreatedLists();
    } catch (error) {
      console.log(error);
      console.log("logout user enter here");
    }
  };

  const deleteUserCreatedListItem = async (itemId) => {
    console.log("itemId inside appContext:");
    console.log(itemId);
    dispatch({ type: DELETE_USER_LIST_BEGIN });
    try {
      await authFetch.delete(`/useritems/${itemId}`);
      console.log("delete userItem should fire from here");
      dispatch({ type: DELETE_USER_LIST_ITEM_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      console.log(error);
      console.log("logout user enter here");
    }
  };

  const setAddItemOrList = async (status) => {
    try {
      dispatch({ type: SET_ADD_ITEM_OR_LIST, payload: { status } });
    } catch (error) {
      console.log(error);
      console.log("error setting AddItem or List to Open or close");
    }
  };

  const setActiveList = async (listId, status) => {
    //Due to list ownership being different for received vs created lists. I have to send a 2nd parameter called 'status'. This will denote which front-end state we use for creating the active list. And thus how we go inside a list on the front end.
    // console.log("listId in appContext");
    // console.log(listId);

    try {
      if (status === "created") {
        const newActiveList = await state.userContributorList.filter(
          (item) => item._id === listId
        );
        console.log("newActiveList");
        console.log(newActiveList);
        dispatch({ type: SET_ACTIVE_LIST, payload: { newActiveList } });
      }
      if (status === "received") {
        const newActiveList = await state.userContributorList.filter(
          (item) => item._id === listId
        );
        console.log("newActiveList");
        console.log(newActiveList);
        dispatch({ type: SET_ACTIVE_LIST, payload: { newActiveList } });
      }
    } catch (error) {
      console.log(error);
      console.log("logout user enter here");
    }
  };

  const setInsideList = (status) => {
    console.log("aC:setInsideList - status: " + status);

    try {
      dispatch({ type: SET_INSIDE_LIST, payload: { status } });
    } catch (error) {
      console.log(error);
      console.log("logout user enter here");
    }
  };

  const setCurrentUserListItems = (list) => {
    console.log("current list items");
    console.log(list);
    try {
      if (list.length >= 1) {
        dispatch({ type: SET_CURRENT_USER_LIST_ITEMS, payload: { list } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setDeleteItemId = (id) => {
    console.log("id");
    console.log(id);
    try {
      dispatch({ type: SET_DELETE_ITEM_ID, payload: { id } });
    } catch (error) {
      console.log(error);
      console.log("logout user enter here");
    }
  };

  // USER LIST ITEMS

  const createUserListItem = async () => {
    dispatch({ type: CREATE_USER_LIST_ITEM_BEGIN });
    const { itemTitle, activeList, insideList, user } = state;
    const userId = user._id;
    console.log("insideList: " + insideList);
    console.log("userId: " + userId);

    const userSelection = { userId: userId, picked: false };
    console.log("userSelection: " + userSelection);
    console.log(JSON.stringify(userSelection));

    const parentListId = activeList[0]._id;
    const creatorId = activeList[0].createdById;
    try {
      if (insideList === "created") {
        await authFetch.post("/useritems", {
          itemTitle,
          parentListId,
          insideList,
          userSelection,
        });
        dispatch({ type: CREATE_USER_LIST_ITEM_SUCCESS });
        dispatch({ type: CLEAR_VALUES });
      }
      if (insideList === "received") {
        console.log("userId inside received: " + userId);
        await authFetch.post("/useritems", {
          itemTitle,
          parentListId,
          insideList,
          userId,
          creatorId,
        });
        dispatch({ type: CREATE_USER_LIST_ITEM_SUCCESS });
        dispatch({ type: CLEAR_VALUES });
      }
      //!quick fix for loading/rendering issues need to fix later
      getUserCreatedListItems();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_USER_LIST_ITEM_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    // console.log(itemTitle);
    // console.log("parentListId " + parentListId);
    // console.log("createUserListItem");
  };

  const getUserCreatedListItems = async () => {
    const { activeList, userContributorList } = state;
    //const parentListId = activeList[0]._id;

    //array of ids from all lists this user is a contributor on
    const userListIds = Array.from(userContributorList, (item) => item._id);
    // console.log("userListIds: " + userListIds);
    // console.log(userListIds);
    dispatch({ type: GET_USER_LIST_ITEM_BEGIN });
    try {
      const { data } = await authFetch.get(`/useritems/listIds/${userListIds}`);
      // console.log("data in here");
      // console.log(data);
      const { allUserItems } = data;
      dispatch({
        type: GET_USER_LIST_ITEM_SUCCESS,
        payload: {
          allUserItems,
        },
      });
    } catch (error) {
      console.log(error.response);
      console.log("error in getUserCreatedListItems");
      //logoutUser()
    }
    clearAlert();

    console.log("getUserCreatedListItems");
  };

  const sendListToFriend = async () => {
    const { activeList, friendTitle, userCreatedItems } = state;
    const sentListTitle = activeList[0].listTitle;
    const activeListId = activeList[0]._id;
    const listCreatorId = activeList[0].createdById;
    console.log("activeListId: " + activeListId);
    try {
      //TODO: can make userIdentifier the global state tracker in future
      const userIdentifier = friendTitle;
      console.log("userIdentifier " + userIdentifier);
      //dispatch({ type: GET_USER_ID})

      //!FIND USER
      const { data } = await authFetch.get(`/auth/finduser/${userIdentifier}`);
      const friendIdentifier = data.foundUser._id;

      console.log("friendIdentifier " + friendIdentifier);
      console.log(friendIdentifier);

      //!CREATE COPY LIST
      await authFetch.post("/userlists/createSentList", {
        friendIdentifier,
        listCreatorId,
        sentListTitle,
      });

      //!GET COPY LIST ID
      const returnData = await authFetch.get(
        `/userlists/createSentList/${friendIdentifier}/${listCreatorId}/${sentListTitle}`
      );
      console.log(returnData.data._id);

      const sentListId = returnData.data._id;
      console.log("sentListId: " + sentListId);

      console.log("activeListId: " + activeListId);
      //!CREATE ITEMS FOR COPY LIST

      // might swap parentListId to ownerLIstId to allow users in the future to share lists that they didnt' create but were shared to them.
      console.log("userCreatedItems: " + userCreatedItems);
      const itemsToCopy = userCreatedItems.filter(
        (item) => item.parentListId === activeListId
      );
      console.log("itemsToCopy");
      console.log(itemsToCopy);
      await authFetch.post("/useritems/copy", {
        sentListId,
        itemsToCopy,
        friendIdentifier,
      });
      clearValues();
    } catch (error) {
      console.log(error.response);
      console.log("error fired");
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearAlert,
        clearValues,
        displayAlert,
        setupUser,
        logoutUser,
        handleChange,
        createUserList,
        createUserSocialList,
        getUserCreatedLists,
        setEditUserCreatedList,
        deleteUserCreatedList,
        deleteUserCreatedListItem,
        setActiveList,
        setAddItemOrList,
        setInsideList,
        setCurrentUserListItems,
        setDeleteItemId,
        createUserListItem,
        getUserCreatedListItems,
        sendListToFriend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
