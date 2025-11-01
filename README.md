# Drone Frontend WebApp
เว็บแอปพลิเคชันส่วนหน้า (Frontend) สำหรับระบบ Drone Project พัฒนาโดยใช้ **Node.js + Vite + React (หรือ Framework ที่ใช้)**

## วิธีรันโปรเจกต์
เข้าไปที่โฟลเดอร์โปรเจกต์
```bash
cd drone-frontend
```
ติดตั้ง Dependencies (รันครั้งแรกเท่านั้น)
```bash
npm install
```
รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
- ถ้าเครื่องมีปัญหาเรื่อง Policy ของ PowerShell ให้ใช้
```bash
powershell.exe -ExecutionPolicy Bypass -Command "npm run dev"
```
- ถ้าไม่มีปัญหา รันได้เลย
```bash
npm run dev
```
เมื่อรันสำเร็จ ระบบจะแสดงลิงก์ประมาณนี้ในเทอร์มินัล:
```
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```
เปิดเบราว์เซอร์และเข้า URL ดังกล่าวเพื่อใช้งานเว็บแอป

## ผู้พัฒนา
**Kritamet Pechraksa**
**66010024**
KMITL | Drone Frontend Project
