// src/api.js

// Dữ liệu sản phẩm mẫu (Linh kiện PC)
export const initialProducts = [
  { id: 1, name: "NVIDIA RTX 4090", price: 40000000, category: "GPU" },
  { id: 2, name: "Intel Core i9-13900K", price: 15000000, category: "CPU" },
  { id: 3, name: "RAM Corsair 32GB", price: 3000000, category: "RAM" },
];

// Hàm giả lập đăng nhập
export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "admin" && password === "123") {
        // Giả lập trả về JWT và Role Admin
        resolve({
          token: "fake-jwt-token-admin-123",
          user: { username: "admin", role: "ADMIN" },
        });
      } else if (username === "user" && password === "123") {
        // Giả lập trả về JWT và Role User
        resolve({
          token: "fake-jwt-token-user-456",
          user: { username: "user", role: "USER" },
        });
      } else {
        reject("Sai tên đăng nhập hoặc mật khẩu!");
      }
    }, 1000);
  });
};