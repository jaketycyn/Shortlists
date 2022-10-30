import React from "react";
import { Link } from "react-router-dom";

import { HiPlus } from "react-icons/hi";
import { useAppContext } from "../context/appContext";

const FooterNav = () => {
  const { addItemOrList, setAddItemOrList } = useAppContext();

  return (
    <div className="h-14 grid grid-rows-1 grid-cols-3 w-full text-center justify-center items-center  ">
      <div className="row-start-1 col-start-1">
        <Link to="/">Home</Link>
      </div>
      <div className="row-start-1 col-start-2"></div>
      <div className="row-start-1 col-start-3 flex justify-center items-center">
        <button
          onClick={() => setAddItemOrList(!addItemOrList)}
          className="flex justify-center items-center w-6 h-6  border-2 border-black "
        >
          <HiPlus />
        </button>
      </div>
    </div>
  );
};

export default FooterNav;
