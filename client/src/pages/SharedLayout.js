import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ActiveList from "../components/ActiveList";
import AddItem from "../components/AddItem";
import AddList from "../components/AddList";
import Share from "../components/Share";

//? Moved FootNav into individual components that need it.
//import FooterNav from "../components/FooterNav";

import NoMatch from "./NoMatch";

//!Reminder that any route existing here needs to also exist as within the App.js file
//? Need to learn why they must both exist for the route to work. Assumption is a generic route has to exist for the browser router to assign but also it has to exist within the protected route.
const SharedLayout = () => {
  return (
    /* New Mobile First Scheme*/

    <div className="flex flex-col overflow-x-hidden  h-screen">
      <main className="bg-backBlue grow flex-1  ">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="list" element={<ActiveList />} />
          <Route exact path="add-list" element={<AddList />} />
          <Route exact path="add-item" element={<AddItem />} />
          <Route exact path="share-list" element={<Share />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>
    </div>
  );
};

export default SharedLayout;
