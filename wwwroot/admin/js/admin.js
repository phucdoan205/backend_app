// js/admin.js - Dành riêng cho trang Quản trị (admin/index.html)

// 1. BẢO VỆ TRANG (Security Guard)
// Kiểm tra ngay lập tức, nếu không phải Admin thì đá ra ngoài luôn
(function checkAdminAuth() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("currentUser");

  if (!token || !userStr) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/login.html";
    return;
  }

  try {
    const user = JSON.parse(userStr);
    // Chuyển role về chữ hoa để so sánh cho chắc
    const roleUpper = user.role ? user.role.toUpperCase() : "";

    if (roleUpper !== "ADMIN") {
      alert("Bạn không có quyền truy cập trang Quản trị!");
      window.location.href = "/index.html"; // Đẩy về trang chủ user
    }
  } catch (e) {
    console.error("Lỗi dữ liệu user:", e);
    localStorage.clear();
    window.location.href = "/login.html";
  }
})();

// 2. XỬ LÝ GIAO DIỆN KHI TRANG ĐÃ LOAD
document.addEventListener("DOMContentLoaded", () => {
  // --- Hiển thị tên Admin ---
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    const user = JSON.parse(userStr);
    const adminNameEl = document.getElementById("adminName");

    // Nếu tìm thấy chỗ hiển thị tên thì điền vào
    if (adminNameEl) {
      adminNameEl.textContent = user.username || "Admin";
    }
  }
const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Chặn thẻ a chuyển trang

            if (confirm("Bạn chắc chắn muốn đăng xuất?")) {
                // Xóa sạch sành sanh mọi thứ
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('role');
                localStorage.removeItem('cart'); // Xóa giỏ hàng (tùy chọn)
                
                // Chuyển hướng về trang Login
                window.location.href = '../login.html';
            }
        });
    }
  
});
