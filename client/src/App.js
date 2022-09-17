import React from "react";

import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import {
  Error,
  Landing,
  Register,
  ProtectedRoute,
  SharedLayout,
} from "./pages/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/list" />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
