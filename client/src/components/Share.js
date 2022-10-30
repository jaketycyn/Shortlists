import React from "react";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";

const Share = () => {
  const {
    activeList,
    friendTitle,
    handleChange,
    sendListToFriend,
    setInsideList,
  } = useAppContext();

  //modified version of going into/making active list
  const goInsideList = () => {
    const status = "created";
    setInsideList(status);
  };

  const handleShareInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(`${name}: ${value}`);
    handleChange({ name, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (friendTitle) {
      console.log("friend submit fired");

      sendListToFriend();
    }
    if (!friendTitle) {
      //future error message
      console.log("incorrect input for sending to friend");
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <div>
        {/* Header Nav: Start */}
        <header className="grid grid-rows-1 grid-cols-4 w-full text-center border-b border-grey p-4 h-14 sticky top-0 z-80">
          {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}

          {/* Placeholder spot for Question mark Icon with Info on sharing
            <div>
                INFO ICON - redirect to sharing infographic
            </div>
        */}
          <div className="col-start-2 col-span-2 row-start-1 text-center items-center justify-between w-full ">
            {activeList[0].listTitle}
          </div>

          <div className="col-start-4 col-span-1 row-start-1 text-blue-600 text-semibold">
            <Link to="/list">Done</Link>
          </div>
        </header>
        {/* Header Nav: End */}
      </div>

      <div className="">
        <div className="">
          <form>
            <div className=" flex flex-col text-center items-center relative z-0 mb-6 w-full group mt-10">
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="email-address-icon"
                  name="friendTitle"
                  value={friendTitle}
                  onChange={handleShareInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="add emails"
                />
              </div>

              <button
                type="button"
                className="items-center px-5 py-2.5 w-40  text-sm mt-8 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                Share
                {/* # to add for future multiple list shares/sends
                <span className="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                 
                </span>
                */}
              </button>

              {/*  SE ND LIST TO FRIEND MODAL/LOGIC
            
            <SendToModal
            isOpen={sendIsOpen}
            afterOpen={afterOpen}
            beforeClose={beforeClose}
            onBackgroundClick={toggleSendModal}
            onEscapeKeydown={toggleSendModal}
            opacity={opacity}
            backgroundProps={{ opacity }}
          >
            <h4>Enter Friend's contact info below:</h4>
            <div>
              <CardFieldset>
                <CardInput
                  className="center-align"
                  type="text"
                  labelText="Email:"
                  name="friendTitle"
                  value={friendTitle}
                  handleChange={handleItemInput}
                />
              </CardFieldset>
            </div>
            <Button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Send List to Friend
            </Button>
            <Button className="close" onClick={() => toggleSendModal()}>
              Close
            </Button>
          </SendToModal>
            
            */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Share;
