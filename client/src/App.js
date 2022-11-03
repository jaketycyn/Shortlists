import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Landing,
  NoMatch,
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
          {/*  These Routes exist here and within the <SharedLayout/>*/}
          <Route path="/list" element />
          <Route path="/share-list" element />
          <Route path="/add-list" element />
          <Route path="/add-item" element />
        </Route>

        <Route path="/register" element={<Register />} />
        {/*
    <Route path="/landing" element={<Landing />} />
    */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
