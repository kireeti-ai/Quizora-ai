import React from "react";
import { Hexagon, LayoutDashboard, Database, LogOut, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../pages/Faculty/Faculty.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <Hexagon size={28} strokeWidth={2.5} />
        <span>Quizora</span>
      </div>

      <div
        className={`nav-link ${
          location.pathname === "/faculty/dashboard" ? "active" : ""
        }`}
        onClick={() => navigate("/faculty/dashboard")}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </div>

      <div
        className={`nav-link ${
          location.pathname === "/faculty/questions" ? "active" : ""
        }`}
        onClick={() => navigate("/faculty/questions")}
      >
        <Database size={20} />
        <span>Question Bank</span>
      </div>
      
      <div className={`nav-link ${location.pathname === "/faculty/ai-generator" ? "active" : ""}`}
     onClick={() => navigate("/faculty/ai-generator")}>
        <Hexagon size={20} />
        <span>AI Generator</span>
      </div>

      <div
        className={`nav-link ${
          location.pathname === "/profile" ? "active" : ""
        }`}
        onClick={() => navigate("/profile")}
      >
        <UserCircle size={20} />
        <span>Profile</span>
      </div>

      <div className="nav-link logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;