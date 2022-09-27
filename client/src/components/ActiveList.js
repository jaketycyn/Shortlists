import { Fragment, useEffect, useState, useRef } from "react";

import { useAppContext } from "../context/appContext";
import { HiDotsHorizontal, HiPlus, HiOutlinePencil } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";

import "flowbite-react";

const ActiveList = () => {
  const {
    activeList,
    allUserItems,
    clearAlert,
    createUserListItem,
    deleteUserCreatedListItem,
    displayAlert,
    getUserCreatedListItems,
    handleChange,
    itemTitle,
    showAlert,
  } = useAppContext();

  const [itemIndex, setItemIndex] = useState("");
  const [hover, setHover] = useState(false);
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

  useEffect(
    () => {
      getUserCreatedListItems();
      console.log("getUserCreatedListItems - UserList");
    },
    setTimeout([showAlert === true]),
    5000
  );

  return (
    <div className=" relative container mx-auto p-6 flex px-4 pb-8 items-start">
      <div className="grid grid-cols-8 relative items-center justify-between w-full">
        <div className="col-start-1 col-end-5  flex px-4 pb-8 items-start">
          <div className=" bg-gray-300 rounded flex-no-shrink w-full p-2 mr-3 ">
            <div className="flex justify-between py-1 items-center">
              <h3 className="text-lg">{activeList[0].listTitle}</h3>
              <div className="h-4 fill-current text-gray-dark cursor-pointer">
                {/* Triple Dot Menu*/}
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
            </div>
            {filteredListByParentId.length >= 1 ? (
              filteredListByParentId.map((item, index) => (
                <div>
                  <div
                    className={`grid grid-cols-4 relative items-center justify-center gap-2 bg-white  p-2 rounded mt-1 border-b border-gray cursor-pointer hover:bg-gray-200 `}
                    index={index}
                    //put key in just to remove annoying error notification
                    key={index}
                    onMouseEnter={() => {
                      setHover(true);
                      setItemIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHover(false);
                      setItemIndex("");
                    }}
                  >
                    <div className="col-start-1 col-span-3 ">
                      {item.itemTitle}
                    </div>
                    {/* Basic Item + Hover Shown*/}
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
                  </div>
                </div>
              ))
            ) : (
              <div>No items in this list. Please add some below</div>
            )}
            <div className="my-8  text-gray-dark rounded items-center">
              <span
                className={`flex items-center justify-center  bg-white p-2 rounded mt-8 border-gray cursor-pointer  hover:bg-gray-400 ${
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
                      onClick={() => setShowTextInput(!showTextInput)}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </span>
            </div>
          </div>
        </div>
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

function DeleteInactiveIcon(props) {
  return (
    <svg
      class="h-4 w-4 mr-2 text-black-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg
      class="h-4 w-4 mr-2 text-black-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
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
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
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
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export default ActiveList;
