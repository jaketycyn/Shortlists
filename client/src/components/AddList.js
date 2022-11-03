import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

import {
  HiX,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiPlus,
} from "react-icons/hi";

const AddList = () => {
  const {
    addItemOrList,
    clearAlert,
    createUserList,
    displayAlert,
    getUserCreatedLists,
    handleChange,
    listTitle,
    setAddItemOrList,
  } = useAppContext();

  const [showToast, setShowToast] = useState(true);
  //use navigate onClick or at the end of a function firing to redirect
  const navigate = useNavigate();

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
    e.preventDefault();
    await createUserList();

    //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
    await clearAlert();
    await getUserCreatedLists();
    await setShowToast(true);
    // basictimeout navigate firing
    await setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="h-full  ">
      <form className="items-center justify-center" onSubmit={handleSubmitList}>
        <header className="grid grid-rows-1 w-full text-center border-b border-grey p-4 sticky top-0">
          {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}

          {/* This should redirect to previous page (historical page) not "/"  */}
          <Link to="/" className="row-start-1">
            <HiX className="mt-1 h-4 w-4" />
          </Link>
          <div className="row-start-1">Title</div>
          <div className="row-start-1">
            <button onClick={() => handleSubmitList()}>
              {/* 
          1. Fire Submission of List
          2. Pop Up Toast saying incomplete items if rquired fields in form not fired
          3?. Possible change link from homepage ('/') to the list itself but thats a finer tuning point
        */}
              <HiOutlineCheck className="mt-1 h-4 w-4" />
            </button>
          </div>
        </header>
        {/* Form Component: Start*/}
        <div
          className="relative mt-2 h-full"
          //onClick={() => setAddItemOrList(false)}
        >
          <div className="flex flex-col items-center">
            {/* Toast: Start*/}
            {showToast ? (
              <div
                id="toast-simple"
                class="flex items-center p-4 space-x-4 w-60 h-14 text-black bg-green-400 rounded-lg divide-x divide-gray-200 shadow"
                role="alert"
              >
                <HiPlus />
                <div class="pl-6 font-normal">List Created</div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* Toast: End */}
          <div // controls opacity of rest of active list when add item/list is selected
            className={`flex flex-row relative container mx-auto p-6  px-4 pb-8 items-start h-full  file:${
              addItemOrList && "opacity-30"
            }`}
          >
            <input
              autoFocus
              className="flex h-20 w-full text-black text-center"
              id="listTitle"
              name="listTitle"
              onChange={handleListTitleInput}
              placeholder="Enter List Name"
              type="text"
              value={listTitle}
              required
            />
          </div>
        </div>
        {/* Form Component: End*/}

        {/* AddItemOrList POPUP Component Start*/}
        {addItemOrList ? (
          <div className="absolute flex bottom-16 right-2 z-10 bg-white">
            <ul className=" grid gap-y-4">
              <button>
                <Link to="/add-list">
                  <li
                    className="flex flex-row justify-center items-center z-10 bg-white-900 h-16 w-32 border-4 "
                    onClick={() => console.log("GO TO Add List")}
                  >
                    <p className="flex flex-row z-10">Add List</p>
                  </li>
                </Link>
              </button>
              <button>
                <Link to="/add-item">
                  <li
                    className=" flex justify-center items-center h-16 w-32 border-4"
                    onClick={() => console.log("GO TO Add Item")}
                  >
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
      </form>
    </div>
  );
};

export default AddList;
