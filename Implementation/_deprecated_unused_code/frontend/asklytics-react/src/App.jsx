import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from './components/Login'
import Chat from './components/Chat'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/chat" element={<Chat/>}  />
      </Routes>
    </Router>
  );
}