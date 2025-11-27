// js/auth.js
const API_URL = 'http://localhost:8080/api/auth'; // Thay bằng URL backend của bạn

// Kiểm tra đăng nhập khi vào dashboard
if (window.location.pathname.includes('dashboard.html')) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Bạn cần đăng nhập với quyền Admin!');
    window.location.href = 'index.html';
  } else {
    // Gọi API kiểm tra token + role
    fetch(API_URL + '/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(user => {
      if (user.role !== 'ADMIN') {
        alert('Bạn không có quyền truy cập trang Admin!');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      } else {
        document.getElementById('adminName').textContent = user.username;
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }
}

// Đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token && data.role === 'ADMIN') {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('loginError').textContent = 'Sai thông tin hoặc không phải Admin!';
    }
  })
  .catch(() => {
    document.getElementById('loginError').textContent = 'Lỗi kết nối server!';
  });
});

// Đăng xuất
document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});