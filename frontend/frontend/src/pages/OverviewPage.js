import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../components/axiosInstance";
import { jwtDecode } from "jwt-decode";

const ChartComponent = ({ title, data, color }) => (
    <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="font-bold mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" reversed />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [humidityIndex, setHumidityIndex] = useState([]);
  const [tempIndex, setTempIndex] = useState([]);
  const [lightIndex, setLightIndex] = useState([]);

  const [humidityData, setHumidityData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [lightData, setLightData] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("TOKEN", token)
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (token == "FACEID"){
      
    } else {
      
      let decoded;
      decoded = jwtDecode(token)
      try {
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          navigate("/login");
          return;
        }
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        navigate("/login");
        return;
      }
    }
    const fetchData = async () => {
      try {
        console.log("FETCH")
        const [humidity, temp, light] = await Promise.all([
          axiosInstance.get("/humidity/record/get/1"),
          axiosInstance.get("/temperature/record/get/1"),
          axiosInstance.get("/brightness/record/get/1"),
        ]);
        console.log("DONE")
        // 3. Lấy lịch sử biểu đồ (10 điểm gần nhất)
        
    
        const formatData = (data) =>
          data.map((item) => {
            const date = new Date(item.timestamp);
            date.setHours(date.getHours() + 7);
        
            const time = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
        
            return {
              time,
              value: item.value,
            };
          });
    
        setHumidityIndex(formatData(humidity.data));
        setTempIndex(formatData(temp.data));
        setLightIndex(formatData(light.data));
          
        const [humidityRes, tempRes, lightRes] = await Promise.all([
          axiosInstance.get("/humidity/record/get/20"),
          axiosInstance.get("/temperature/record/get/20"),
          axiosInstance.get("/brightness/record/get/20"),
        ]);

        setHumidityData(formatData(humidityRes.data));
        setTempData(formatData(tempRes.data));
        setLightData(formatData(lightRes.data));
        
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar activeItem="overview" />
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Enviroment Condition</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-white shadow rounded-lg flex items-center border border-black">
              <span className="text-2xl mr-2">🌡️</span>
              <div>
                <p className="text-gray-700">Temperature</p>
                <p className="font-bold">
                  {tempIndex.length > 0 ? `${tempIndex[0].value}°C` : "Loading"}
                </p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center border border-black">
              <span className="text-2xl mr-2">☀️</span>
              <div>
                <p className="text-gray-700">Brightness</p>
                <p className="font-bold">
                  {lightIndex.length > 0 ? `${lightIndex[0].value}%` : "Loading"}
                </p>
              </div>
            </div>
            <div className="p-4 bg-white shadow rounded-lg flex items-center border border-black">
              <span className="text-2xl mr-2">💧</span>
              <div>
                <p className="text-gray-700">Humidity</p>
                <p className="font-bold">
                  {humidityIndex.length > 0 ? `${humidityIndex[0].value}%` : "Loading"}
                </p>
              </div>
            </div>
          </div>

          {/* <h2 className="text-xl font-bold mt-6">Lastest </h2>
          <img src={PlantPicture} alt="Cây xanh" className="w-60 h-40 mt-2 rounded shadow" /> */}

          <h2 className="text-xl font-bold mt-6">Statistics in 24 hours ago</h2>
            <div className="grid grid-cols-2 gap-6">
                <ChartComponent title="Biểu đồ nhiệt độ" data={tempData} color="#ff7300" />
                <ChartComponent title="Biểu đồ ánh sáng" data={lightData} color="#fdd835" />
                <ChartComponent title="Biểu đồ độ ẩm" data={humidityData} color="#2196f3" />
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardOverview;
