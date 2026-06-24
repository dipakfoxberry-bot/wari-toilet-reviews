import React from "react";
import { Routes, Route } from "react-router-dom";
import RatingPage from "./pages/RatingPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rating/:id" element={<RatingPage />} />
    </Routes>
  );
}

export default App;