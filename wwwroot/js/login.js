const API = "http://localhost:5062/api/auth/login";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const loadingOverlay = document.getElementById("loading-overlay");
  
  // Reset error message
  errorMsg.textContent = "";
  errorMsg.style.display = "none";
  
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Đăng nhập thất bại" }));
      errorMsg.textContent = errorData.message || "Sai tài khoản hoặc mật khẩu";
      errorMsg.style.display = "block";
      errorMsg.style.color = "#ff4444";
      return;
    }
    
    const data = await res.json();
    
    // Lưu token
    localStorage.setItem("token", data.token);
    
    // Decode JWT để lấy thông tin user
    const payload = JSON.parse(atob(data.token.split(".")[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                 payload["role"] || 
                 payload["roles"];
    
    // Lưu thông tin user vào localStorage (để các trang khác sử dụng)
    const userInfo = {
      username: username,
      role: role
    };
    localStorage.setItem("currentUser", JSON.stringify(userInfo));
    localStorage.setItem("role", role);
    
    // Hiển thị loading overlay
    loadingOverlay.style.display = "flex";
    
    // Redirect sau 1 giây
    setTimeout(() => {
      if (role === "Admin") {
        window.location.href = "/admin/index.html";
      } else {
        window.location.href = "/user/index.html";
      }
    }, 1000);
    
  } catch (error) {
    errorMsg.textContent = "Lỗi kết nối. Vui lòng thử lại sau.";
    errorMsg.style.display = "block";
    errorMsg.style.color = "#ff4444";
    console.error("Login error:", error);
  }
});



