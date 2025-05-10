# 🏠 Smart Home System

A full-featured smart home system with facial recognition for secure access and real-time monitoring and control of home devices. Built with a Node.js backend, Python facial recognition, and frontend integration (e.g., React). Sensors and actuators are connected and controlled throught AdaFruitIO and Microbit.

## 🚀 Features

### 🔐 Face ID Authentication
- **Login via Face ID**: Authenticate users securely with a webcam and face recognition.
- **Register New Users**: Capture and save a user's face for future authentication.
- **Manage Face Data**: Delete face data of specific users from the system.

### 📡 Sensor Monitoring
- View real-time data from:
  - 🌡️ **Temperature**
  - 💧 **Humidity**
  - 💡 **Brightness**

### 🔌 Actuator Control
- Control home devices such as:
  - 🌀 **Fan**
  - 💡 **Light**

## 🧠 System Architecture

## ▶️ How to Run

Follow these steps to run the Smart Home System on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-home-system.git
cd smart-home-system
```

### 2. Run BackEnd

```bash
cd backend
npm install
pip install torch torchvision numpy opencv-python facenet_pytorch
npm start
```

### 3. Run FrontEnd

```bash
cd frontend/frontend
npm install
npm start
```


