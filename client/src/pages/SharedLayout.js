import { Navigate, Routes, Route } from "react-router-dom";

import { SideNavbar } from "../components";

import Home from "./Home";

import ActiveList from "../components/ActiveList";
import Error from "./Error";

// import UserListClassic from "../../components/UserListClassic";
// import UserListSocial from "../../components/UserListSocial.js";
// import UserListReceived from "../../components/UserListReceived";

const SharedLayout = () => {
  return (
    <div className="flex">
      <aside className="h-screen sticky top-0">
        <SideNavbar />
      </aside>

      <main className="bg-backBlue flex flex-1 overflow-y-auto paragraph px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ActiveList />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </div>
  );
};

//tailwindcss setup1
// <main className="relative flex-col h-screen">
//       <div className="flex flex-1 overflow-hidden">
//         <div className="flex bg-gray-100 w-32 p-4">
//           <SideNavbar />
//         </div>

//         <div className="flex flex-1 bg-blue-300 overflow-y-auto paragraph px-4">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/list" element={<ActiveList />} />
//             <Route path="*" element={<Error />} />
//           </Routes>
//         </div>
//       </div>
//     </main>

// <Route path="/mylists/classic" element={<UserListClassic />} />
//           <Route path="/mylists/social" element={<UserListSocial />} />
//           <Route path="/mylists/received" element={<UserListReceived />} />

export default SharedLayout;
