import React from "react";

import { Link } from "react-router-dom";

//! THIS PAGE IS NOT DIRECTED TO RIGHT NOW IT IS DEFUNCT CURRENTLY
// Routing is instead to a landing page towards the Register.js page.
//

const Landing = () => {
  return (
    <div className="justify-center flex-col  w-full mt-32 pb-24 md:pb-5 p-5">
      <div className="text-center ">
        <p className="">Welcome to Shortlists!</p>
      </div>
      <div className="mt-20 ml-80">
        <h4>Here are the basics</h4>
        <button
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="submit"
        >
          <Link to="/register">Login/Register</Link>
        </button>
      </div>
    </div>
  );
};
export default Landing;
