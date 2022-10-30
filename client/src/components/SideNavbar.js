//! OLD SIDE NAVBAR FOR DESKTOP VERSION
//? has been migrated into the Home.js for mobile
// changes have been done on Home and this may be used later as a side insert of sorts

import { React, Fragment, useEffect, useState, useRef } from "react";

import { useAppContext } from "../context/appContext";

import { HiDotsHorizontal, HiPlus, HiOutlinePencil } from "react-icons/hi";

import { Dialog, Menu, Transition } from "@headlessui/react";

import { Modal, Button } from "flowbite-react";

import { BsArrowLeftShort, BsChevronDown, BsPlusLg } from "react-icons/bs";
import { ImBooks } from "react-icons/im";
import { Link } from "react-router-dom";

const SideNavbar = () => {
  const {
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
    setInsideList,
    showAlert,
    user,
    userContributorList,
  } = useAppContext();
  const [open, setOpen] = useState(true);
  const [showListTitleInput, setShowListTitleInput] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
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
    await clearAlert();
    await getUserCreatedLists();
  };

  //List Info
  const UserCreatedSocialLists = userContributorList.filter(
    (item) => item.contributors.length > 1 && item.createdById === user._id
  );
  const UserReceivedSocialLists = userContributorList.filter(
    (item) => item.contributors.length > 1 && item.createdById !== user._id
  );
  const UserClassicLists = userContributorList.filter(
    (item) => item.contributors.length === 1
  );

  return (
    <div
      className={`bg-gray-900 h-screen p-5 pt-8 duration-300 relative w-full
      ${open ? "" : ""} `}
      onMouseLeave={() => setShowListTitleInput(false)}
    >
      <BsArrowLeftShort
        className={`bg-white text-blue-900 text-3xl rounded-full absolute outline outline-2 -right-4 top-9 border-gray-900 outline-gray-900 cursor-pointer ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      />
      <div className="flex">
        <Link to="/">
          <h1
            className={`text-white origin-left font-medium text-3xl duration-300 w-60 ${
              !open && "hidden"
            } `}
          >
            Shortlists
          </h1>
        </Link>
      </div>
      <div className="flex items-center rounded-md text-white bg-light-white">
        <ul className="pt-2">
          <div>
            <li
              className={`text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-dark-blue  mt-2 ${
                subMenuOpen && "border-b-2"
              }`}
            >
              {UserClassicLists.length >= 1 && (
                <BsChevronDown
                  className={`  ${!open && "hidden"} ${
                    subMenuOpen && "rotate-180"
                  }`}
                  onClick={() => setSubMenuOpen(!subMenuOpen)}
                />
              )}
              <span
                className={`text-base font-medium flex-1 ${!open && "hidden"}`}
                onClick={() => setSubMenuOpen(!subMenuOpen)}
              >
                Classic Lists
              </span>

              <div
                id="dropdownBottom"
                className={`hidden p-4 w-full max-w-sm  border  shadow-md divide-y divide-gray-100 sm:p-6 md:p-8 bg-gray-800 border-gray-700 ${
                  !open && "hidden"
                }`}

                //p-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700
              >
                <h5 className="text-xl mb-4 text-center font-medium  text-white">
                  Create List
                </h5>
                <ul
                  className="flex relative py-4 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownBottomButton"
                >
                  <li>
                    <form
                      onSubmit={handleSubmitList}
                      className="items-center justify-center"
                    >
                      <input
                        type="text"
                        id="listTitle"
                        className="block mt-2 py-2 px-4 hover:bg-gray-200 hover:text-black"
                        placeholder="Enter list name..."
                        name="listTitle"
                        value={listTitle}
                        onChange={handleListTitleInput}
                        required
                      />
                      <span className="mt-6 flex  items-center justify-center ">
                        <button
                          className="text-white  bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-sm text-sm px-4 py-3 text-center  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          type="submit"
                          onClick={(e) => handleSubmitList(e)}
                        >
                          Add List
                        </button>
                      </span>
                    </form>
                  </li>
                </ul>
              </div>
            </li>
            {UserClassicLists.length >= 1 && subMenuOpen && (
              <ul>
                {UserClassicLists.map((list, index) => (
                  <div
                    className={`text-blue-300 text-sm flex relative items-center justify-between gap-x-4 cursor-pointer p-2 px-5 hover:bg-gray-300  hover:text-gray-900 rounded-md ${
                      !open && "hidden"
                    }`}
                    onClick={() => goInsideList(list._id)}
                  >
                    <Link
                      to="/list"
                      key={index}
                      onClick={() => goInsideList(list._id)}
                      className="w-full h-full"
                    >
                      {list.listTitle}
                    </Link>

                    <Menu
                      as="div"
                      className=" flex relative items-center justify-center w-10 h-10"
                    >
                      <Menu.Button className="flex items-center justify-center w-6 h-6  hover:bg-gray-900 hover:text-blue-300 rounded-md z-0">
                        <HiDotsHorizontal />
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
                                        setShowShareForm(!showShareForm)
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
                  </div>
                ))}
              </ul>
            )}
          </div>

          {/* Add List Module*/}
          <li className={`${!open && "hidden"}`}>
            <div
              className="flex items-center justify-center text-gray-800 rounded"
              //?Commenting out for now kinda annoying for new users and wont work on mobile anyway
              //onMouseLeave={() => setShowListTitleInput(false)}
              //onMouseEnter={() => setSubMenuOpen(true)}
            >
              <span
                className={` p-2 rounded mt-8  cursor-pointer bg-gray-400 hover:bg-blue-800 ${
                  showListTitleInput && "hidden"
                }`}
                onClick={() => {
                  setShowListTitleInput(!showListTitleInput);
                  setSubMenuOpen(true);
                }}
              >
                Add a list...
              </span>
              <span className={`${!showListTitleInput && "hidden"}`}>
                <div>
                  <input
                    type="text"
                    id="listTitle"
                    className="block h-20 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 "
                    name="listTitle"
                    value={listTitle}
                    onChange={handleListTitleInput}
                    required
                  />

                  <span className="flex items-center justify-center my-4">
                    <button
                      className="bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-log text-sm px-4 py-2.5 text-center"
                      onClick={handleSubmitList}
                    >
                      Add List
                    </button>
                  </span>
                  <span className="flex items-center justify-center my-4">
                    <button
                      className="bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-log text-sm px-4 py-2.5 text-center"
                      onClick={() => setShowListTitleInput(!showListTitleInput)}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <Transition.Root show={showShareForm} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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

      <div
        className={`capitalize flex text-base text-white font-medium flex-1 my-20  ${
          !open && "hidden"
        }`}
      >
        {user.name}
      </div>
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
      class="h-4 w-4 mr-2 text-black-900"
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
      class="h-4 w-4 mr-2 text-black-900"
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

export default SideNavbar;
