import { Fragment, useEffect, useState, useRef } from "react";

import { useAppContext } from "../context/appContext";
import {
  HiDotsHorizontal,
  HiPlus,
  HiOutlinePencil,
  HiOutlineChevronLeft,
} from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

import FooterNav from "./FooterNav";
import Share from "./Share";

import "flowbite-react";

const ActiveList = () => {
  const {
    activeList,
    addItemOrList,
    allUserItems,
    clearAlert,
    clearItemValue,
    createUserListItem,
    deleteUserCreatedListItem,
    displayAlert,
    getUserCreatedListItems,
    handleChange,
    itemTitle,
    setAddItemOrList,
    showAlert,
  } = useAppContext();

  const [itemIndex, setItemIndex] = useState("");
  const [hover, setHover] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showItemOptions, setShowItemOptions] = useState(false);

  //   console.log("parentListId");
  //   console.log(parentListId);

  //   console.log("allUserItems");
  //   console.log(allUserItems);

  const parentListId = activeList[0]._id;
  const filteredListByParentId = allUserItems.filter(
    (item) => item.parentListId === parentListId
  );

  const handleDeleteItem = async (id) => {
    await deleteUserCreatedListItem(id);
    await getUserCreatedListItems();
    // console.log("handleDeleteItem Fired");
    // console.log("id");
    // console.log(id);
    // console.log("id to delete is: " + id);
  };

  const handleItemInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log(`${name}: ${value}`)
    handleChange({ name, value });
  };

  const clearItemInput = () => {
    setShowTextInput(!showTextInput);

    clearItemValue();
  };

  const handleSubmit = (e) => {
    //doing both friend title submit + item list submit in 1 submit button. Could be better to separate, but i believe by setting up explicit "if" statements with variables I'll be able to control for each use case.
    e.preventDefault();
    if (!itemTitle) {
      displayAlert();
      return;
    }

    if (itemTitle) {
      createUserListItem();
      //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
      clearAlert();
      getUserCreatedListItems();
    }
    // if (friendTitle && !itemTitle) {
    //   console.log("friend submit fired");

    //   sendListToFriend();
    //   //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
    //   // clearAlert();
    //   // getUserCreatedListItems();
    // }
  };

  useEffect(() => {
    getUserCreatedListItems();
    console.log("getUserCreatedListItems - UserList");
  }, []);

  return (
    <div
      // flex flex-col h-screen justify-between cause the header stick top-0 to stay above the main div
      className="flex flex-col h-screen justify-between"
    >
      {/* Header Nav: Start */}

      <header className="grid grid-rows-1 w-full text-center border-b border-grey p-4 h-14 sticky top-0 z-80">
        {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        <Link to="/" className="row-start-1">
          <HiOutlineChevronLeft className="mt-1 h-4 w-4" />
        </Link>
        <div className="row-start-1 text-center items-center justify-between w-full ">
          {activeList[0].listTitle}
        </div>
        <div className="row-start-1">
          <Link to="/share-list">Share Icon</Link>
        </div>
        <div className="row-start-1">... </div>
      </header>
      {/* Header Nav: End */}
      <div
        // controls opacity of rest of active list when add item/list is selected
        className={`grid grid-flow-row auto-rows-max   p-2 m-6 h-full items-center z-0 overflow-scroll ${
          addItemOrList && "opacity-30"
        }`}
        onClick={() => setAddItemOrList(false)}
      >
        <div className="grid relative  ">
          <div className="items-center text-center py-1  ">
            <h3 className="text-lg ">{activeList[0].listTitle}</h3>
            {/* Triple Dot Menu for List: Begin*/}
            {/*
            <div className=" fill-current h-4 text-gray-dark cursor-pointer">
            
                    <Menu as="div" className="relative w-10 h-10 z-10">
                      <Menu.Button className="flex items-center justify-center w-6 h-6 hover:bg-gray-400  rounded-md">
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
                                  onClick={() => console.log("sharing item")}
                                >
                                  {active ? (
                                    <ShareActiveIcon
                                      className="mr-2 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <ShareInactiveIcon
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
                                  onClick={() => console.log(activeList[0]._id)}
                                >
                                  {active ? (
                                    <DeleteActiveIcon
                                      className="mr-2 h-5 w-5  text-violet-400"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <DeleteInactiveIcon
                                      className="mr-2 h-5 w-5 text-violet-400"
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
                         */}
            {/* Triple Dot Menu for List: End*/}
          </div>
          {filteredListByParentId.length >= 1 ? (
            filteredListByParentId.map((item, index) => (
              <div>
                <div
                  className={`grid grid-cols-4 font-semibold relative gap-2 bg-white  p-2  mt-1 border-2 border-black border-solid rounded-lg cursor-pointer z-0 hover:bg-gray-200 `}
                  index={index}
                  //put key in just to remove annoying error notification
                  key={index}
                  // onMouseEnter={() => {
                  //   setHover(true);
                  //   setItemIndex(index);
                  // }}
                  // onMouseLeave={() => {
                  //   setHover(false);
                  //   setItemIndex("");
                  // }}
                >
                  <div className="col-start-1 col-span-3 ">
                    {item.itemTitle}
                  </div>
                  {/* Basic Item + Hover Shown Item list: Begin*/}
                  {/* 
                    {hover && index === itemIndex ? (
                      <div className="col-start-4 col-end-5  col-span-1 absolute flex  right-0 ">
                        <Menu
                          as="div"
                          className="relative flex items-center justify-center w-10 h-10 z-10"
                        >
                          <Menu.Button
                            className=" mr-3 mb-3 md:mb-0 text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-1 py-1 text-center i"
                            onClick={() => {
                              setShowItemOptions(!showItemOptions);
                              setShowTextInput(false);
                            }}
                          >
                            <HiOutlinePencil />
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
                            <Menu.Items className="absolute left-12  w-36 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                                      onClick={() => handleDeleteItem(item._id)}
                                    >
                                      {active ? (
                                        <DeleteActiveIcon
                                          className="mr-2 h-5 w-5  text-violet-400"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <DeleteInactiveIcon
                                          className="mr-2 h-5 w-5 text-violet-400"
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
                    ) : (
                      ""
                    )}
                    */}
                  {/* Basic Item + Hover Shown Item list: End*/}
                </div>
              </div>
            ))
          ) : (
            <div>No items in this list. Please add some below</div>
          )}
          <div className="my-8  text-gray-dark rounded items-center">
            <span
              className={`flex items-center justify-center  bg-blue-400  p-2 mt-8 border-2 border-black border-solid rounded-lg cursor-pointer  hover:bg-gray-400 ${
                showTextInput && "hidden"
              }`}
              onClick={() => {
                setShowTextInput(!showTextInput);
                setShowItemOptions(false);
              }}
            >
              Add an item...
            </span>

            <span className={` ${!showTextInput && "hidden"}`}>
              <div>
                <input
                  type="text"
                  id="itemTitle"
                  className="block h-20 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter a title for this card..."
                  name="itemTitle"
                  value={itemTitle}
                  onChange={handleItemInput}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  onTouchCancel={() => setFocus(false)}
                  onTouchEnd={() => setFocus(false)}
                  required
                />
                <span className="mt-6 flex relative items-center justify-center ">
                  <button
                    className="text-white absolute left-0    bg-green-500 hover:bg-green-800focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center "
                    onClick={handleSubmit}
                  >
                    Add Item
                  </button>
                  <button
                    className="text-white absolute right-0 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center  "
                    onClick={() => clearItemInput()}
                  >
                    Cancel
                  </button>
                </span>
              </div>
            </span>
          </div>
        </div>
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
      {!hasFocus ? (
        <div className="flex absolute bottom-0 w-full text-center border-t border-grey items-center z-10 bg-white">
          <FooterNav />
        </div>
      ) : null}

      {/* Footer: End*/}
    </div>
  );
};

export default ActiveList;
