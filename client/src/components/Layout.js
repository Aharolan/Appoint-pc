import React, { useState } from "react";
import "../Layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const [collapse, setCollapse] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userMenu = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Rent computer", path: "/rent-computer", icon: "ri-macbook-line" },
    { name: "Profile", path: "/profile", icon: "ri-user-settings-line" },
    {
      name: "Logout",
      path: "/login",
      icon: "ri-login-box-line",
      onClick: handleLogout,
    },
  ];

  const adminMenu = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Computers", path: "/computers", icon: "ri-macbook-line" },
    { name: "Users", path: "/users", icon: "ri-user-line" },
    { name: "Profile", path: "/profile", icon: "ri-user-settings-line" },
    {
      name: "Logout",
      path: "/login",
      icon: "ri-login-box-line",
      onClick: handleLogout,
    },
  ];

  const renderMenu = user?.isAdmin ? adminMenu : userMenu;

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>{`${!collapse ? "לנציצקי מחשבים" : ""}`}</h1>
          </div>
          <div className="menu">
            {renderMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  onClick={menu.onClick}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapse && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="content">
          <div className="header">
            <i
              className={`${
                !collapse
                  ? "ri-close-line layout-action-icon"
                  : "ri-menu-2-line layout-action-icon"
              }`}
              onClick={() => setCollapse(!collapse)}
            ></i>
            <div className="d-flex align-items-center px-3">
              <i className="ri-notification-2-line layout-action-icon mr-2 px-3"></i>
              <Link className="anchor" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
