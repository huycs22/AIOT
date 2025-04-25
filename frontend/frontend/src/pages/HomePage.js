import React from "react";
import { useNavigate } from "react-router-dom";  
import Footer from "../components/Footer";
import LogoBk from "../assets/LogoBK.png";
import Logo from "../assets/LogoWebsite.png";
import homepagePic1 from "../assets/homepagePic1.png";
import homepagePic2 from "../assets/homepagePic2.png";
import homepagePic3 from "../assets/homePage3.png";
const HomePage = () => {
    const navigate = useNavigate(); 
    return (
        <div className="font-sans">
            <nav className="flex justify-between items-center p-4 border-b bg-blue-200">
                <div className="flex items-center space-x-2">
                    <img src={LogoBk} alt="Logo" className="w-[50px]" />
                    <span className="font-semibold text-lg">Trường đại học Bách Khoa - Đại học Quốc Gia TPHCM</span>
                </div>
                <div className="space-x-4">
                    <button 
                        onClick={() => navigate("/register")} 
                        style={{ border: "2px solid black", backgroundColor: "white", padding: "8px 16px", borderRadius: "5px" }}
                    >
                        Đăng kí
                    </button>
                    <button 
                        onClick={() => navigate("/login")} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Đăng nhập
                    </button>
                </div>
            </nav>
          
            <div className="flex justify-center items-center p-4 space-x-20">
                <div className="text-center py-10 px-6">
                    <h1 className="text-4xl font-bold ">
                        Hệ thống nhà thông minh
                    </h1>
                    <h2 className="text-5xl text-blue-500 mt-2 font-dancing">SmartHome</h2>
                    <img src={Logo} alt="Logo" className="w-[330px] mx-auto" />
                    <p className="text-lg mt-4">
                    Hãy để công nghệ giúp bạn quản lý ngôi nhà!
                    </p>
                    <p className="text-lg">Trải nghiệm ngay hệ thống quản lý của SmartHome</p>
                    
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <img src={homepagePic1} alt="Logo" className="w-[330px]" />
                    <img src={homepagePic2} alt="Logo" className="w-[330px]" />
                    {/* <img src={homepagePic3} alt="Logo" className="" /> */}
                </div>
            </div>
    
            <Footer />
        </div>
    );
};

export default HomePage;
