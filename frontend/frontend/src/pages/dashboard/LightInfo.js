import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../components/axiosInstance";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const DashboardLightPage = () => {
  const [lightBound, setLightBound] = useState({
    lowest: null,
    highest: null,
  });

  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ lowest: "", highest: "" });
  const [error, setError] = useState(null);
  const [currentLight, setCurrentLight] = useState(null);
  const navigate = useNavigate();
  const [isManualMode, setIsManualMode] = useState(undefined);
  const [lightHistory, setLightHistory] = useState([]);
  const [lightOn, setLightOn] = useState(undefined);
  const [lightControlError, setLightControlError] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

    const fetchCurrentLight = async () => {
      try {
        const res = await axiosInstance.get("/brightness/record/get/recent/?n=1");
        if (res.data && res.data.length > 0) {
          setCurrentLight(res.data[0].value);
        }
      } catch (err) {
        console.error("Lỗi khi lấy ánh sáng hiện tại:", err);
      }
    };
    const fetchLightMode = async () => {
      try {
        const res = await axiosInstance.get("/light/condition/mode");
        console.log("MODE", res.data.value)
        setIsManualMode(res.data.value);
      } catch (err) {
        console.error("Lỗi khi lấy chế độ điều chỉnh:", err);
      }
    };

    fetchLightMode();
    fetchCurrentLight();
  }, [navigate]);

  const fetchPaginatedHistory = async (page) => {
    setIsLoadingHistory(true); // Bắt đầu tải
    try {
      const pageSize = 5;
      const res = await axiosInstance.get(`/light/history/?page=${page}pageSize=${pageSize}`);
      const formatted = res.data.results.map((item) => ({
        time: new Date(item.timestamp).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: item.value > 0 ? "Bật" : "Tắt",
      }));
  
      setLightHistory(formatted);
      console.log(res, res.data.count, res.data.results.length)
      setTotalPages(Math.ceil(res.data.count / pageSize));
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đèn:", err);
    } finally {
      setIsLoadingHistory(false); // Kết thúc tải dù thành công hay lỗi
    }
  };
  useEffect(() => {
    fetchPaginatedHistory(historyPage);
  }, [historyPage, lightOn]);

  const fetchCurrentLightStatus = async () => {
    try {
      const res = await axiosInstance.get("/light/history/?page=1"); // Trang đầu
      const data = res.data.results;
      if (data.length > 0) {
        const latest = data[0]; // Phần tử đầu tiên là mới nhất
        setLightOn(latest.value > 0 ? true : false);
      }
    } catch (err) {
      console.error("Lỗi khi lấy trạng thái đèn:", err);
    }
  };
  
  useEffect(() => {
    fetchCurrentLightStatus();
  }, []);


  useEffect(() => {
    setHistoryPage(1);
  }, [isManualMode, lightOn]);
  
  useEffect(() => {
    if (isManualMode) {
      setLightControlError(null);
    }
  }, [isManualMode]);

  const toggleLight = async () => {
    console.log(isManualMode)
    if (isManualMode == 0) {
      setLightControlError("Chỉ có thể điều chỉnh đèn ở chế độ thủ công.");
      return;
    }
  
    try {
      const newValue = lightOn ? 0 : 1;
      console.log("VALUE", newValue)
      const res = await axiosInstance.post("/light/control", {
        value: newValue,
      });
      
      
      setLightOn(newValue);
      setLightControlError(null);
    } catch (err) {
      if (err.response?.status === 400) {
        setLightControlError(err.response.data.value?.[0] || "Lỗi giá trị gửi lên.");
      } else if (err.response?.status === 405) {
        setLightControlError(err.response.data.detail);
      } else {
        setLightControlError("Đã xảy ra lỗi khi điều chỉnh đèn.");
      }
    }
  };
  
  const handleModeChange = async (manual) => {
    try {
      console.log("HANDLE", manual)
      await axiosInstance.put("/light/control/mode/", { manual });
      setIsManualMode(manual);
    } catch (err) {
      console.error("Lỗi khi cập nhật chế độ:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar activeItem="light" />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div className="w-[60%]">
              <h2 className="text-xl font-bold mb-4">Độ sáng hiện tại</h2>
              <div className="w-48 p-4 bg-white border shadow rounded-lg flex items-center">
                <span className="text-2xl mr-2">☀️</span>
                <div>
                  <p className="text-gray-700">Ánh sáng</p>
                  <p className="font-bold">
                    {currentLight !== null ? `${currentLight} %` : "Đang tải..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Ngưỡng ánh sáng */}
            
          </div >

          {/* Chế độ điều chỉnh */}
          
          <h2 className="text-xl font-bold mt-6 mb-2">Chế độ điều chỉnh</h2>
          <div className="grid grid-cols-2 gap-x-2 w-[50%] font-bold">
            <div className="p-4 py-6 bg-white border shadow rounded-lg flex items-center aria-busy={isManualMode===undefined}">
              <input
                type="radio"
                name="light-mode"
                className="mr-2"
                disabled={isManualMode === undefined}
                checked={isManualMode === 1}
                onChange={() => handleModeChange(1)}
              />
              <p>
                {isManualMode===undefined ? "Đang tải…" : "Thủ công"}
               </p>
            </div>
            <div className="p-4 py-6 bg-white border shadow rounded-lg flex items-center aria-busy={isManualMode===undefined}">
              <input
                type="radio"
                name="light-mode"
                className="mr-2"
                checked={isManualMode === 0}
                onChange={() => handleModeChange(0)}
              />
              <p>
                {isManualMode===undefined ? "Đang tải…" : "Tự động"}
              </p>
            </div>
          </div>

          {/* Điều chỉnh đèn */}
          <h2 className="text-xl font-bold mt-6 mb-2">Điều chỉnh đèn</h2>
          <div className="w-[20%] bg-white border shadow rounded-lg flex items-center p-4 py-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={lightOn===undefined ? false : lightOn}
                onChange={toggleLight}
                disabled={lightOn===undefined}
              />
              <div className={`relative w-11 h-6 ${!isManualMode ? 'bg-gray-300' : 'bg-gray-400'} peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${lightOn ? 'peer-checked:bg-blue-500' : ''}`}></div>
              <span className="ms-3 text-sm font-bold">{lightOn===undefined ? "Đang tải…" : (lightOn ? "Bật" : "Tắt")}</span>
            </label>
          </div>

          {lightControlError && (
            <div className="mt-2 text-red-600 text-sm w-[40%]">{lightControlError}</div>
          )}


          {/* Lịch sử bật/tắt đèn */}
          <h2 className="text-xl font-bold mt-6 mb-2">Lịch sử bật, tắt đèn</h2>
          <div className="w mx-auto border rounded-lg shadow-md bg-white">
            {isLoadingHistory ? ( 
              <div className="p-4 text-sm text-gray-500">Đang tải lịch sử...</div>
            ) : lightHistory.length > 0 ? (
              lightHistory.map((item, index) => (
                <div key={index} className="flex items-center px-4 py-3 border-b last:border-none">
                  <span className="mr-2 text-lg">💡</span>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">Thời gian: {item.time}</p>
                    <p className={`text-sm ` + (item.status === "Bật"? "text-green-600" : "text-red-600")}>
                      Trạng thái: {item.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500">Không có dữ liệu.</div>
            )}

            {/* 🔽 Thêm phân trang ở đây */}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                disabled={historyPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Trang trước
              </button>
              <span>
                Trang {historyPage} / {totalPages}
              </span>
              <button
                onClick={() => setHistoryPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={historyPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
            {/* 🔼 Kết thúc phân trang */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLightPage;




