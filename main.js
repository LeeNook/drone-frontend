// --- 1. การตั้งค่าเริ่มต้นและตัวแปร ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DRONE_ID = import.meta.env.VITE_DRONE_ID;

let droneConfig = null;

const pages = {
  config: document.querySelector('#page-config'),
  form: document.querySelector('#page-form'),
  logs: document.querySelector('#page-logs'),
};
const navLinks = document.querySelectorAll('.nav-link');
const configDetails = document.querySelector('#config-details');
const logForm = document.querySelector('#log-form');
const logsTableBody = document.querySelector('#logs-table-body');

// --- 2. โค้ดสำหรับจัดการการเปลี่ยนหน้า ---
function showPage(pageId) {
  for (const pageName in pages) {
    pages[pageName].style.display = 'none';
  }
  pages[pageId].style.display = 'block';
}

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const pageId = event.target.id.split('-')[1];
    showPage(pageId);

    // ถ้าคลิกไปที่หน้า logs ให้ดึงข้อมูลมาแสดง
    if (pageId === 'logs') {
      fetchAndRenderLogs();
    }
  });
});

// --- 3. การดึงและแสดงผลข้อมูล Config (Page #1) ---
async function fetchAndRenderConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/configs/${DRONE_ID}`);
    if (!response.ok) {
      throw new Error(`ไม่สามารถดึงข้อมูล config ได้ Server ตอบกลับมาว่า ${response.status}`);
    }
    const data = await response.json();
    droneConfig = data;

    configDetails.innerHTML = `
      <p><strong>Drone ID:</strong> ${droneConfig.drone_id}</p>
      <p><strong>Drone Name:</strong> ${droneConfig.drone_name}</p>
      <p><strong>Light:</strong> ${droneConfig.light}</p>
      <p><strong>Country:</strong> ${droneConfig.country}</p>
    `;
  } catch (error) {
    configDetails.innerHTML = `<p style="color: red;">เกิดข้อผิดพลาด: ${error.message}</p>`;
    console.error(error);
  }
}

// --- 4. จัดการการส่งข้อมูลจาก Log Form (Page #2) ---
logForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!droneConfig) {
    alert('ยังไม่สามารถโหลดข้อมูล Config ของโดรนได้ กรุณาลองอีกครั้ง');
    return;
  }
  
  const celsiusInput = event.target.elements.celsius;
  const celsiusValue = celsiusInput.value;

  const logData = {
    drone_id: droneConfig.drone_id,
    drone_name: droneConfig.drone_name,
    country: droneConfig.country,
    celsius: parseInt(celsiusValue, 10),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถบันทึก Log ได้');
    }

    alert('บันทึก Log สำเร็จ!');
    celsiusInput.value = '';
    
    // (เพิ่มเติม) หลังจากบันทึกสำเร็จ ให้สลับไปหน้า View Logs แล้วโหลดข้อมูลใหม่
    showPage('logs');
    fetchAndRenderLogs();

  } catch (error) {
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
    console.error(error);
  }
});

// --- 5. ดึงและแสดงผลข้อมูล Logs (Page #3) ---
async function fetchAndRenderLogs() {
  logsTableBody.innerHTML = '<tr><td colspan="5">Loading logs...</td></tr>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/logs/${DRONE_ID}`);
    if (!response.ok) {
      throw new Error(`ไม่สามารถดึงข้อมูล logs ได้ Server ตอบกลับมาว่า ${response.status}`);
    }
    const logs = await response.json();
    logsTableBody.innerHTML = '';

    if (logs.length === 0) {
      logsTableBody.innerHTML = '<tr><td colspan="5">ยังไม่มีข้อมูล Log</td></tr>';
      return;
    }

    logs.forEach(log => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(log.created).toLocaleString('th-TH')}</td>
        <td>${log.country}</td>
        <td>${log.drone_id}</td>
        <td>${log.drone_name}</td>
        <td>${log.celsius}</td>
      `;
      logsTableBody.appendChild(row);
    });
  } catch (error) {
    logsTableBody.innerHTML = `<tr><td colspan="5" style="color: red;">เกิดข้อผิดพลาด: ${error.message}</td></tr>`;
    console.error(error);
  }
}

// --- 6. การเริ่มต้นการทำงานของแอป ---
showPage('config');
fetchAndRenderConfig();

// ----7
// --- 🎨 ฟังก์ชันสลับธีม (Light / Dark) ---
const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

// ตรวจสอบธีมจาก localStorage หรือจากระบบ
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// ตั้งค่าเริ่มต้น
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  root.classList.add('dark');
  themeToggle.textContent = '🌞';
} else {
  root.classList.remove('dark');
  themeToggle.textContent = '🌙';
}

// ฟังก์ชันสลับธีมเมื่อกดปุ่ม
themeToggle.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  themeToggle.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
