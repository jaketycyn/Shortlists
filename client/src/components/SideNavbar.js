import { Fragment, useEffect, useState, useRef } from "react";

import { useAppContext } from "../context/appContext";

import { HiDotsHorizontal, HiPlus, HiOutlinePencil } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";

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
    e.preventDefault();
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
  // console.log("userContributorList");
  // console.log(userContributorList);
  //End of List Info

  // const UserClassicLists = [
  //   {
  //     listTitle: "title1",
  //     author: "author1",
  //     items: ["item1", "item2", "item3"],
  //   },
  //   { listTitle: "title2", author: "author2" },
  //   { listTitle: "title3", author: "author3" },
  // ];

  return (
    <div
      className={`bg-gray-900 h-screen p-5 pt-8 duration-300 relative 
      ${open ? "sm:w-20 md:w-72" : "w-20"} `}
    >
      <BsArrowLeftShort
        className={`bg-white text-blue-900 text-3xl rounded-full absolute  right-0 top-9 border-blue-900 cursor-pointer ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      />
      <div className="flex">
        <Link to="/">
          <ImBooks
            className={` bg-white text-4xl rounded cursor-pointer block float-left duration-400 mr-4 ${
              !open && "rounded-full"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-3xl duration-300 ${
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

              <button
                id="dropdownBottomButton"
                data-dropdown-toggle="dropdownBottom"
                data-dropdown-placement="bottom"
                className={` mr-3 mb-3 md:mb-0 text-white  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  !open && "hidden"
                }`}
                type="button"
                //onClick={() => setSubMenuOpen(true)}
              >
                <BsPlusLg className={` ${!open && "hidden"}`} />
              </button>
              <div
                id="dropdownBottom"
                className="hidden p-4 w-full max-w-sm  border  shadow-md divide-y divide-gray-100 sm:p-6 md:p-8 bg-gray-800 border-gray-700"

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
                          onClick={() => handleSubmitList}
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
                      className=" flex relative items-center justify-center w-10 h-10 z-10"
                    >
                      <Menu.Button className="flex items-center justify-center w-6 h-6  hover:bg-gray-900 hover:text-blue-300 rounded-md">
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
                        <Menu.Items className="absolute left-0 mt-2 w-36 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                                  Share
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
        </ul>
      </div>
      <div className="capitalize text-white flex text-base font-medium flex-1">
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

export default SideNavbar;
