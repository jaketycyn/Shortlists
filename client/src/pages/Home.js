//! OLD SIDE NAVBAR FOR DESKTOP VERSION

import { React, Fragment, useEffect, useState, useRef } from "react";

import { useAppContext } from "../context/appContext";

import {
  HiOutlineDotsVertical,
  HiPlus,
  HiOutlineChevronRight,
} from "react-icons/hi";

import { Dialog, Menu, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import FooterNav from "../components/FooterNav";

const Home = () => {
  const {
    addItemOrList,
    clearAlert,
    createUserList,
    deleteUserCreatedList,
    displayAlert,
    getUserCreatedListItems,
    getUserCreatedLists,
    handleChange,
    listTitle,
    sendListToFriend,
    setActiveList,
    setAddItemOrList,
    setInsideList,
    showAlert,
    user,
    userContributorList,
  } = useAppContext();

  // subMenu State & Functions
  const [subMenuIndexes, setSubMenuIndexes] = useState([]);
  const [userListsOpen, setUserListsOpen] = useState(true);
  const [userReceivedListsOpen, setUserReceivedListsOpen] = useState(true);
  //const [subMenuIndex, setSubMenuIndex] = useState();

  const toggleSubMenu = (index, subMenuIndexes) => {
    //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in. Thus we use newIndex
    const newIndex = index + 1;
    const subMenuIndexFound = subMenuIndexes.find((i) => i === newIndex);
    if (subMenuIndexFound) {
      //setSubMenuIndexes([...subMenuIndexes], newIndex + 1);
      const result = subMenuIndexes.filter((item) => item !== newIndex);
      setSubMenuIndexes(result);
    } else {
      setSubMenuIndexes((subMenuIndexes) => [...subMenuIndexes, newIndex]);
    }
  };

  const [showShareForm, setShowShareForm] = useState(false);

  //need to figure out where to place these calls and prevent repeated calls
  useEffect(() => {
    getUserCreatedLists();
  }, []);

  //how we setup active list
  const goInsideList = async (_id) => {
    const status = "created";
    await setActiveList(_id, status);
    await setInsideList(status);
  };

  const handleDeleteList = async (id) => {
    await deleteUserCreatedList(id);
    await getUserCreatedLists();
  };

  const handleListTitleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log(`${name}: ${value}`)
    handleChange({ name, value });
  };

  const handleSubmitList = async (e) => {
    if (!listTitle) {
      displayAlert();
      return;
    }

    //can add is editing functionality later if needed
    // if (isEditing) {
    //   editUserList()
    //   return
    // }

    await createUserList();

    //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
    //await clearAlert();
    //await getUserCreatedLists();
  };

  //List Info
  // const UserCreatedSocialLists = userContributorList.filter(
  //   (item) => item.contributors.length > 1 && item.createdById === user._id
  // );
  const UserReceivedSocialLists = userContributorList.filter(
    (item) => item.contributors.length > 1 && item.createdById !== user._id
  );
  const UserClassicLists = userContributorList.filter(
    (item) => item.contributors.length === 1
  );

  return (
    <div className="flex flex-col h-screen justify-between gap-2  ">
      <div className="" onClick={() => setAddItemOrList(false)}>
        <header className="flex flex-col absolute top-0 w-full h-14 mb-2  text-center items-center border-2 z-10 bg-white  pt-4">
          <h1 className="font-semibold">Shortlists</h1>
          {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        </header>

        <div className="flex flex-col items-center rounded-md text-black m-2 z-0 ">
          <ul className="pt-2 w-5/6 ">
            {/* My Lists Button: Begin*/}
            <div className=" flex flex-col items-center text-center ">
              <button
                className={`grid grid-rows-1 grid-cols-4  mt-12 h-30 w-1/2 font-semibold items-center text-center border-2 border-slate-400 rounded-lg ${
                  !userListsOpen && "bg-gray-300"
                }`}
                onClick={() => setUserListsOpen(!userListsOpen)}
              >
                <HiOutlineChevronRight
                  //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                  className={`grid row-start-1 row-span-1 col-start-1 col-span-1 m-2 ${
                    userListsOpen && "rotate-90"
                  } `}
                />

                <h1 className="grid row-start-1 row-span-1 col-start-2 col-span-2">
                  My lists
                </h1>
              </button>
            </div>
            {/* My Lists Button: End*/}

            {/* Display UserClassicLists Module: Begins*/}
            <div // controls opacity of rest of active list when add item/list is selected
              className={` h-full relative items-center container z-0 ${
                addItemOrList && "opacity-30"
              }`}
            >
              {UserClassicLists.length >= 1 && userListsOpen && (
                <ul className="snap-x">
                  {UserClassicLists.map((list, index) => (
                    <div
                      className="text-black text-sm flex relative  items-center justify-between gap-x-2 cursor-pointer border-2 border-gray-600 mt-2  hover:bg-gray-300  hover:text-gray-900 rounded-md snap-center"
                      //! removing connection for now - want to allow items to quick add from main menu
                      // onClick={() => goInsideList(list._id)}
                      key={index}
                    >
                      <button className="w-10 h-10 p-2 bg-gray-200 flex relative items-center">
                        <HiOutlineChevronRight
                          //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                          className={`w-4 h-4 ${
                            subMenuIndexes.find((i) => i === index + 1) &&
                            "rotate-90"
                          } `}
                          onClick={() => {
                            toggleSubMenu(index, subMenuIndexes);
                          }}
                        />
                      </button>
                      <Link
                        to="/list"
                        key={index}
                        onClick={() => goInsideList(list._id)}
                        className="w-full h-full bg-yellow-400 p-2"
                      >
                        {list.listTitle}
                      </Link>

                      <Menu
                        as="div"
                        className=" flex relative items-center justify-center "
                      >
                        <Menu.Button className="flex items-center justify-center w-8 h-8 bg-purple-400  hover:bg-gray-900 hover:text-blue-300 rounded-md z-0">
                          <HiOutlineDotsVertical className="" />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 mt-2 w-36 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="px-1 py-1 ">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-violet-500 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={() =>
                                      console.log("Edit - Triple Dot Clicked")
                                    }
                                  >
                                    {active ? (
                                      <EditActiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <EditInactiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-red-800 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={
                                      () =>
                                        console.log(
                                          "Share List - Triple Dot Clicked"
                                        )
                                      //fire module screen
                                      //share list._id to email provided on module
                                      //create item for user_Id that exists for email that exists.
                                    }
                                  >
                                    {active ? (
                                      <ShareActiveIcon
                                        className="mr-2 h-5 w-5 "
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ShareInactiveIcon
                                        className="mr-2 h-5 w-5 bg-pink-400"
                                        aria-hidden="true"
                                      />
                                    )}
                                    share
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-red-800 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={() => handleDeleteList(list._id)}
                                  >
                                    {active ? (
                                      <DeleteActiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <DeleteInactiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="flex items-center justify-center  p-2 hover:bg-gray-900 h-8 w-8 bg-red-400 rounded-md z-0">
                        <HiPlus
                          className="h-4 w-4"
                          onClick={() => console.log("add item")}
                        />
                      </div>
                    </div>
                  ))}
                </ul>
              )}
              {/* Display UserClassicLists Module: End*/}
            </div>
            {/* My Lists Button: Begin*/}
            <div className=" flex flex-col items-center text-center ">
              <button
                className={`grid grid-rows-1 grid-cols-4  mt-12 h-30 w-1/2 font-semibold items-center text-center border-2 border-slate-400 rounded-lg ${
                  !userReceivedListsOpen && "bg-gray-300"
                }`}
                onClick={() => setUserReceivedListsOpen(!userReceivedListsOpen)}
              >
                <HiOutlineChevronRight
                  //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                  className={`grid row-start-1 row-span-1 col-start-1 col-span-1 m-2 ${
                    userReceivedListsOpen && "rotate-90"
                  } `}
                />

                <h1 className="grid row-start-1 row-span-1 col-start-2 col-span-2">
                  Others
                </h1>
              </button>
            </div>
            {/* My Lists Button: End*/}

            {/* Display UserSocialLists Module: Begins*/}
            <div // controls opacity of rest of active list when add item/list is selected
              className={` h-full relative items-center container pb-20 pt-12 z-0 ${
                addItemOrList && "opacity-30"
              }`}
            >
              {UserReceivedSocialLists.length >= 1 && userReceivedListsOpen && (
                <ul>
                  {UserReceivedSocialLists.map((list, index) => (
                    <div
                      className="text-black text-sm flex relative  items-center justify-between gap-x-2 cursor-pointer border-2 border-gray-600 mt-2 hover:bg-gray-300  hover:text-gray-900 rounded-md"
                      //! removing connection for now - want to allow items to quick add from main menu
                      // onClick={() => goInsideList(list._id)}
                      key={index}
                    >
                      <button className="w-10 h-10 p-2 bg-gray-200 flex relative items-center">
                        <HiOutlineChevronRight
                          //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                          className={`w-4 h-4 ${
                            subMenuIndexes.find((i) => i === index + 1) &&
                            "rotate-90"
                          } `}
                          onClick={() => {
                            toggleSubMenu(index, subMenuIndexes);
                          }}
                        />
                      </button>
                      <Link
                        to="/list"
                        key={index}
                        onClick={() => goInsideList(list._id)}
                        className="w-full h-full bg-yellow-400 p-2"
                      >
                        {list.listTitle}
                      </Link>

                      <Menu
                        as="div"
                        className=" flex relative items-center justify-center "
                      >
                        <Menu.Button className="flex items-center justify-center w-8 h-8 bg-purple-400  hover:bg-gray-900 hover:text-blue-300 rounded-md z-0">
                          <HiOutlineDotsVertical className="" />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 mt-2 w-36 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="px-1 py-1 ">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-violet-500 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={() =>
                                      console.log("Edit - Triple Dot Clicked")
                                    }
                                  >
                                    {active ? (
                                      <EditActiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <EditInactiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-red-800 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={
                                      () =>
                                        console.log(
                                          "Share List - Triple Dot Clicked"
                                        )
                                      //fire module screen
                                      //share list._id to email provided on module
                                      //create item for user_Id that exists for email that exists.
                                    }
                                  >
                                    {active ? (
                                      <ShareActiveIcon
                                        className="mr-2 h-5 w-5 "
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ShareInactiveIcon
                                        className="mr-2 h-5 w-5 bg-pink-400"
                                        aria-hidden="true"
                                      />
                                    )}
                                    share
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-red-800 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={() => handleDeleteList(list._id)}
                                  >
                                    {active ? (
                                      <DeleteActiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <DeleteInactiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="flex items-center justify-center  p-2 hover:bg-gray-900 h-8 w-8 bg-red-400 rounded-md z-0">
                        <HiPlus
                          className="h-4 w-4"
                          onClick={() => console.log("add item")}
                        />
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>
            {/* Display UserSocialLists Module: End*/}
          </ul>
        </div>

        <Transition.Root show={showShareForm} as={Fragment}>
          <Dialog as="div" className="relative z-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="company-website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Share with a Friend
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm ">
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Add email"
                        />
                        <button
                          type="button"
                          className="inline-flex w-full h-2justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setShowShareForm(false)}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
      {/* AddItemOrList Component Start*/}
      {addItemOrList ? (
        <div className="absolute flex bottom-16 right-2 z-10 bg-white">
          <ul className=" grid gap-y-4">
            <button>
              <Link to="/add-list" onClick={() => setAddItemOrList(false)}>
                <li className="flex flex-row justify-center items-center z-10 bg-white-900 h-16 w-32 border-4 ">
                  <p className="flex flex-row z-10">Add List</p>
                </li>
              </Link>
            </button>
            <button>
              <Link to="/add-item" onClick={() => setAddItemOrList(false)}>
                <li className=" flex justify-center items-center h-16 w-32 border-4">
                  <p className="flex flex-row ">Add Item</p>
                </li>
              </Link>
            </button>
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      {/* AddItemOrList Component End*/}
      {/* Footer: Start*/}
      {/* Look into Changing the Height of the Nav Item */}
      <div className="flex absolute bottom-0 w-full text-center border-t border-grey items-center z-40 bg-white">
        <FooterNav />
      </div>
      {/* Footer: End*/}
    </div>
  );
};

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#252629"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#252629"
        stroke="#252629"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DeleteInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#252629"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#252629" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#252629" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#252629"
        stroke="#252629"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#252629" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#252629" strokeWidth="2" />
    </svg>
  );
}

function ShareActiveIcon(props) {
  return (
    <svg
      className="h-4 w-4 mr-2 text-black-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
function ShareInactiveIcon(props) {
  return (
    <svg
      className="h-4 w-4 mr-2 text-black-900"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export default Home;
