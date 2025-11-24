const API = "http://localhost:5062/api/auth/login";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const loadingOverlay = document.getElementById("loading-overlay");
  
  // Reset UI
  errorMsg.textContent = "";
  errorMsg.style.display = "none";
  
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || "Đăng nhập thất bại";
      errorMsg.style.display = "block";
      return;
    }
    
    console.log("---------- DEBUG LOGIN ----------");
    console.log("1. Server trả về:", data);

    // 1. Xử lý Role (Ưu tiên lấy từ data.role)
    // Nếu server trả về null, dùng chuỗi rỗng để tránh lỗi
    let roleRaw = data.role || ""; 
    let roleUpper = roleRaw.toString().trim().toUpperCase();

    console.log("2. Role chuẩn hóa:", roleUpper);

    // 2. Lưu vào Storage (QUAN TRỌNG: Lưu Role vào trong currentUser)
    localStorage.setItem("token", data.token);
    
    const userInfo = {
      username: data.username || username,
      role: roleUpper // Lưu luôn dạng IN HOA
    };
    localStorage.setItem("currentUser", JSON.stringify(userInfo));
    
    // 3. Hiển thị loading
    loadingOverlay.style.display = "flex";
    
    // 4. Chuyển hướng
    setTimeout(() => {
      const baseUrl = window.location.origin; 

      if (roleUpper === "ADMIN") {
        console.log("=> GO TO ADMIN");
        // window.location.href = `${baseUrl}/admin/index.html`;
        window.location.href = "admin/index.html";
      } else {
        console.log("=> GO TO USER");
        // window.location.href = `${baseUrl}/user/index.html`;
        window.location.href = `user/index.html`;
      }
    }, 1000);
    
  } catch (error) {
    errorMsg.textContent = "Lỗi kết nối Server!";
    errorMsg.style.display = "block";
    console.error("Login Error:", error);
  }
});