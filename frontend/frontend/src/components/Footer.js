 import React from "react";
import Logo from "../assets/LogoWebsite.png";

const Footer = () => {
  return (
    <footer className="bg-blue-200 p-6 ">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <img src={Logo} alt="SmartHome" className="w-16" />
          <p className="font-bold">SmartHome</p>
        </div>
        <div>
          <h3 className="font-semibold">Địa chỉ</h3>
          <p>KTX khu B, ĐHQG HCM</p>
          <p>KTX khu A, ĐHQG HCM</p>
        </div>
        <div>
          <h3 className="font-semibold">Hotline</h3>
          <p>1900 6868</p>
          <p>1900 3636</p>
        </div>
        <div>
          <h3 className="font-semibold">Email</h3>
          <p>smart.home@hcmut.edu.vn</p>
          <p>tech.smarthome@hcmut.edu.vn</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
