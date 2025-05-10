import React from "react";
import { NavLink } from "react-router-dom"
const Sidebar = ({ activeItem }) => {
  const items = [
    { label: "Tổng quan thông số", path: "/dashboard/overview", key: "overview", isMain: true },
    //{ label: "Thông báo chung", path: "/dashboard/notifications", key: "notifications" },
    { label: "Ánh sáng", path: "/dashboard/light", key: "light" },
    { label: "Nhiệt độ", path: "/dashboard/temperature", key: "temperature" },
    { label: "Độ ẩm", path: "/dashboard/humidity", key: "humidity" },
    { label: "Face ID", path: "/dashboard/faceid", key: "disease-status" },
  ];

  return (
    <div className="w-1/6 bg-blue-500 text-white p-2">
      <ul className="w-full">
        {items.map((item) => (
          <li
          key={item.key}
          className={`py-3 pl-4 rounded-lg cursor-pointer ${item.isMain ? "text-lg font-bold" : "text-sm pl-6 font-bold"} 
            ${activeItem === item.key ? "bg-gray-300 text-black font-bold" : "hover:bg-blue-600"}`}
          >
            <NavLink
              to={item.path}
              className="block"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
    
  );
};

export default Sidebar;
