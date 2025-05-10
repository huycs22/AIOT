// src/pages/FaceVerification.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// import-all images under src/data/test_images
const reqImages = require.context(
  "../FaceNet-Infer/data/test_images",
  true,
  /\.(png|jpe?g|svg)$/
);

const ImageModal = ({ src, onClose }) => (
  <AnimatePresence>
    {src && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          src={src}
          alt="Face"
          className="max-w-full max-h-full rounded-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={e => e.stopPropagation()}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

const FaceVerification = () => {
  // 1) State for users & image preview
  const [users, setUsers]               = useState([]);  
  const [selectedImage, setSelectedImage] = useState(null);

  // 2) Loading state for registration button
  const [loadingRegister, setLoadingRegister] = useState(false);

  // 3) Move your directory‑scanning logic into a reusable function
  const fetchUsers = () => {
    const map = {};
    reqImages.keys().forEach((key) => {
      const parts = key.replace(/^\.\//, "").split("/");
      const user = parts[0];
      const src = reqImages(key);
      if (!map[user]) map[user] = [];
      map[user].push(src);
    });
    // const list = Object.entries(map).map(([name, images]) => ({ name, images }));
    const list = Object.entries(map)
  .map(([name, images]) => ({ name, images }))
  .sort((a, b) => a.name.localeCompare(b.name));

    setUsers(list);
  };

  // 4) On mount, load the users once
  useEffect(fetchUsers, []);

  // 5) Trigger your Python script via your Node server
  const handleRegister = async () => {
    // const username = prompt("Enter user name for face registration:");
    // if (!username) return;
    setLoadingRegister(true);
    try {
      const res = await fetch("http://localhost:5001/api/face_capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: prompt("Enter user name:") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unknown error");
      alert("Face capture succeeded:\n" + json.output);
      // after success, re‑scan the folder so the new user appears
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Face capture failed: " + err.message);
    } finally {
      setLoadingRegister(false);
    }
  };

  // 6) Remove a user from state
  const handleDelete = async (name) => {
    if (!window.confirm(`Delete user "${name}" and their images?`)) return;

    try {
      const res = await fetch("http://localhost:5001/api/delete_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unknown error");
      fetchUsers(); // reload user list
    } catch (err) {
      console.error(err);
      alert("Failed to delete user: " + err.message);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar activeItem="face-verification" />

        <div className="flex-1 p-6 bg-gray-50">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Face Verification Management
            </h1>
            <button
              onClick={handleRegister}
              disabled={loadingRegister}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loadingRegister ? "Registering…" : "Register New Face"}
            </button>
          </div>

          {/* Users list */}
          {users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((u) => (
                <li
                  key={u.name}
                  className="flex items-center justify-between bg-white p-4 shadow rounded"
                >
                  <span className="text-lg font-medium">{u.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setSelectedImage(u.images[0])}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View ({u.images.length})
                    </button>
                    <button
                      onClick={() => handleDelete(u.name)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No authorized users found.</p>
          )}

          {/* Full‑screen image preview */}
          <ImageModal
            src={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FaceVerification;
