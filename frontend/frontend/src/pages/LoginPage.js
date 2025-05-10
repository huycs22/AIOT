import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Logo from "../assets/LogoWebsite.png";

const LoginPage = () => {
    const navigate = useNavigate();   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/user/login/", { email, password });
            const data = res.data;
            if (data.error){
                setError("Đăng nhập thất bại"); 
            }
            else {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                navigate("/dashboard/overview");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const error_message = err.response.data.error
                if (error_message == "Invalid Credential"){
                    setError("Tài khoản hoặc mật khẩu không chính xác");
                } else {
                    setError(error_message);
                }
            } else {
                setError("Có lỗi xảy ra khi kết nối đến server");
            }
        }
    };

    const handleFaceLogin = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/user/face-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}) // Add any payload if needed later
            });

            const data = await res.json(); // Properly extract the JSON
            console.log(data)
            if (data.success) {
                console.log("SUCCESS")
                localStorage.setItem("access_token", "FACEID");
                localStorage.setItem("refresh_token", "FACEID");
                navigate("/dashboard/overview");
            } else {
                setError("Đăng nhập bằng khuôn mặt thất bại");
            }
        } catch (err) {
            setError("Đăng nhập bằng khuôn mặt thất bại");
        }
    };


    return (
        <div className="flex h-screen justify-center items-center">
            <div className="w-full max-w-md flex flex-col justify-center items-center px-8">
                <img src={Logo} alt="SmartHome" className="w-24 mb-4" />
                <h2 className="text-3xl font-bold text-blue-700 font-dancing">SmartHome</h2>
                <p className="text-gray-500 mb-6">Chào mừng bạn đến với SmartHome</p>

                <form className="w-full" onSubmit={handleLogin}>
                    <label className="block text-gray-500 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Nhập email"
                        className="w-full p-3 border rounded-lg mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block text-gray-500 font-medium mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="w-full p-3 border rounded-lg mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <div>
                            <input type="checkbox" id="remember" className="mr-1" />
                            <label htmlFor="remember">Lưu đăng nhập</label>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-blue-500 hover:underline"
                        >
                            Quên mật khẩu
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <button
                    onClick={handleFaceLogin}
                    className="w-full mt-2 py-3 bg-green-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Đăng nhập bằng Face ID
                </button>



                <button onClick={() => navigate("/")} className="mt-4 text-blue-500 hover:underline">
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
